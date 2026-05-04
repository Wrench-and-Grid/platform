from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import FileResponse

from app.core.rate_limit import rate_limit_resume

router = APIRouter(prefix="/api/v1", tags=["resume"])

# Resolved once at import time — path is stable regardless of working directory.
_RESUME_PATH = Path(__file__).parent.parent.parent / "Daisy_Gonzalez_Resume.pdf"


@router.get(
    "/resume",
    summary="Download resume PDF",
    response_class=FileResponse,
    responses={
        200: {"description": "PDF file download"},
        404: {"description": "Resume not available"},
        429: {"description": "Too many requests"},
    },
)
async def download_resume(
    request: Request,
    _: None = Depends(rate_limit_resume),
) -> FileResponse:
    if not _RESUME_PATH.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume is not currently available.",
        )
    return FileResponse(
        path=_RESUME_PATH,
        media_type="application/pdf",
        filename="Daisy-Gonzalez-Resume.pdf",
    )
