import logging

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import AsyncSessionLocal, get_db
from app.models import ContactSubmission
from app.rate_limit import rate_limit_contact
from app.schemas import ContactRequest, ContactResponse, ErrorDetail, ValidationErrorResponse
from app.services.email import send_admin_notification

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["contact"])


async def _notify_and_flag(submission_id: int, name: str, email: str, subject: str | None, message: str) -> None:
    """Background task: send admin email then update the email_sent flag."""
    email_sent = await send_admin_notification(submission_id, name, email, subject, message)
    if email_sent:
        try:
            async with AsyncSessionLocal() as session:
                row = await session.get(ContactSubmission, submission_id)
                if row:
                    row.email_sent = True
                    await session.commit()
        except SQLAlchemyError:
            logger.warning("Could not update email_sent flag for #%d", submission_id)


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
        429: {"description": "Too many requests"},
        500: {"description": "Internal server error"},
    },
    summary="Submit a contact-form message",
)
async def submit_contact(
    payload: ContactRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(rate_limit_contact),
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

    # ── 2. Notify (true fire-and-forget via BackgroundTasks) ─────────────────
    # The email is dispatched after the response is sent so SMTP latency never
    # touches the client.  The background task opens its own DB session to
    # update the email_sent flag once delivery is confirmed.
    background_tasks.add_task(
        _notify_and_flag,
        submission.id,
        payload.name,
        str(payload.email),
        payload.subject,
        payload.message,
    )

    return ContactResponse(
        success=True,
        message="Thank you! I'll be in touch soon.",
        submission_id=submission.id,
    )


# ── Validation error helpers ──────────────────────────────────────────────────
# Two converters are needed because FastAPI and Pydantic raise different
# exception types for the same kind of failure:
#
#   fastapi.exceptions.RequestValidationError  — raised by FastAPI when request
#       body parsing fails (before the route handler is called).  Its .errors()
#       method returns Pydantic v2 error dicts with loc prefixed by "body".
#
#   pydantic.ValidationError — raised inside a route handler when a Pydantic
#       model is constructed manually.  Same dict shape, no "body" prefix.
#
# Both are registered on the app in main.py.

def _loc_to_field(loc: tuple) -> str:
    """Convert a Pydantic loc tuple to a dot-separated field name.

    Strips the leading 'body' segment that FastAPI adds for request-body
    errors so the frontend receives 'name' not 'body.name'.
    """
    parts = [str(p) for p in loc if p != "body"]
    return ".".join(parts) if parts else "unknown"


def _errors_to_response(error_list: list[dict]) -> JSONResponse:
    errors = [
        ErrorDetail(field=_loc_to_field(e["loc"]), message=e["msg"])
        for e in error_list
    ]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ValidationErrorResponse(errors=errors).model_dump(),
    )


def request_validation_error_to_response(exc: RequestValidationError) -> JSONResponse:
    """Handles FastAPI's RequestValidationError (raised during body parsing)."""
    return _errors_to_response(exc.errors())


def pydantic_error_to_response(exc: ValidationError) -> JSONResponse:
    """Handles pydantic.ValidationError raised inside a route handler."""
    return _errors_to_response(exc.errors())
