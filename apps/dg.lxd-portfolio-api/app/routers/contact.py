from __future__ import annotations

import asyncio
import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import ContactSubmission
from app.schemas import ContactRequest, ContactResponse, ErrorDetail, ValidationErrorResponse
from app.services.email import send_admin_notification

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["contact"])


def _client_ip(request: Request) -> str:
    """
    Resolve the real client IP, honouring the X-Forwarded-For header that
    reverse proxies (Nginx, Caddy, Vercel, Cloudflare) inject.
    """
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()[:45]
    return (request.client.host if request.client else "unknown")[:45]


@router.post(
    "/contact",
    response_model=ContactResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        422: {"model": ValidationErrorResponse, "description": "Validation failure"},
        500: {"description": "Internal server error"},
    },
    summary="Submit a contact-form message",
)
async def submit_contact(
    payload: ContactRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> ContactResponse:
    """
    Data flow
    ─────────
    1. FastAPI + Pydantic validate and sanitise the incoming JSON payload.
    2. A ContactSubmission ORM object is written to the database via SQLAlchemy.
    3. An async admin email notification is dispatched (fire-and-forget; a
       failure does NOT roll back the DB write — the submission is preserved).
    4. The email_sent flag is updated and a success response is returned.
    """
    ip = _client_ip(request)
    logger.info("Contact submission from %s — name=%r email=%r", ip, payload.name, str(payload.email))

    # ── 1. Persist ────────────────────────────────────────────────────────────
    submission = ContactSubmission(
        name=payload.name,
        email=str(payload.email),
        subject=payload.subject,
        message=payload.message,
        ip_address=ip,
    )

    try:
        db.add(submission)
        await db.commit()
        await db.refresh(submission)
    except SQLAlchemyError as exc:
        await db.rollback()
        logger.error("Database write failed: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save your message. Please try again.",
        ) from exc

    logger.info("Submission #%d persisted successfully", submission.id)

    # ── 2. Notify (async, non-blocking) ──────────────────────────────────────
    # We schedule the email as a background task so it never blocks the HTTP
    # response.  The result is awaited immediately here but could also be handed
    # to BackgroundTasks if latency becomes a concern at scale.
    email_sent = await asyncio.wait_for(
        send_admin_notification(
            submission.id,
            payload.name,
            str(payload.email),
            payload.subject,
            payload.message,
        ),
        timeout=20,  # seconds — generous but bounded
    )

    if email_sent:
        try:
            submission.email_sent = True
            await db.commit()
        except SQLAlchemyError:
            logger.warning("Could not update email_sent flag for #%d", submission.id)

    return ContactResponse(
        success=True,
        message="Thank you! I'll be in touch soon.",
        submission_id=submission.id,
    )


# ── Custom validation error handler ──────────────────────────────────────────
# Registered on the app in main.py so Pydantic errors return our schema,
# not FastAPI's default 422 body.

def pydantic_error_to_response(exc: ValidationError) -> JSONResponse:
    errors = [
        ErrorDetail(field=".".join(str(loc) for loc in e["loc"]), message=e["msg"])
        for e in exc.errors()
    ]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ValidationErrorResponse(errors=errors).model_dump(),
    )
