"""
dg.lxd Portfolio — Contact API
================================
Start locally:  uvicorn main:app --reload --port 8000
Docs:           http://localhost:8000/docs
"""
from __future__ import annotations

import asyncio
import logging
import logging.config
import logging.handlers
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.exceptions import HTTPException as FastAPIHTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import ValidationError

from app.core.config import settings
from app.core.database import init_db
from app.core.rate_limit import limiter
from app.api.contact import (
    pydantic_error_to_response,
    request_validation_error_to_response,
    router as contact_router,
)
from app.api.resume import router as resume_router

# ── Logging ───────────────────────────────────────────────────────────────────

LOGGING_CONFIG: dict = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s [%(levelname)-8s] %(name)s: %(message)s",
            "datefmt": "%Y-%m-%dT%H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "stream": "ext://sys.stdout",
        },
        "rotating_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "standard",
            "filename": "api.log",
            "maxBytes": 5 * 1024 * 1024,  # 5 MB
            "backupCount": 5,
            "encoding": "utf-8",
        },
    },
    "root": {
        "handlers": ["console", "rotating_file"],
        "level": "INFO",
    },
    # Quieten noisy third-party loggers
    "loggers": {
        "uvicorn.access": {"level": "WARNING"},
        "sqlalchemy.engine": {"level": "WARNING"},
    },
}

logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)



# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("Starting up — initialising database…")
    await init_db()
    logger.info("Database ready.  Email configured: %s", settings.email_configured)
    yield
    logger.info("Shutting down.")


# ── Application ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="dg.lxd Portfolio API",
    description="Contact-form ingestion endpoint for the Grid Design portfolio.",
    version="1.0.0",
    lifespan=lifespan,
    # Restrict docs to non-production environments
    docs_url="/docs",
    redoc_url="/redoc",
)

app.state.limiter = limiter

# CORS — only the listed origins may POST to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
    max_age=600,
)

app.include_router(contact_router)
app.include_router(resume_router)


# ── Exception handlers ────────────────────────────────────────────────────────

@app.exception_handler(FastAPIHTTPException)
async def http_exception_handler(request: Request, exc: FastAPIHTTPException) -> JSONResponse:
    logger.warning("HTTP %s on %s: %s", exc.status_code, request.url.path, exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": str(exc.detail)},
    )


@app.exception_handler(RequestValidationError)
async def request_validation_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    logger.warning("Request validation error on %s: %s", request.url.path, exc.errors())
    return request_validation_error_to_response(exc)


@app.exception_handler(ValidationError)
async def validation_error_handler(request: Request, exc: ValidationError) -> JSONResponse:
    logger.warning("Validation error on %s: %s", request.url.path, exc)
    return pydantic_error_to_response(exc)


@app.exception_handler(asyncio.TimeoutError)
async def timeout_handler(request: Request, exc: asyncio.TimeoutError) -> JSONResponse:
    logger.error("Timeout on %s", request.url.path)
    return JSONResponse(
        status_code=504,
        content={"success": False, "message": "Request timed out. Please try again."},
    )


@app.exception_handler(Exception)
async def global_error_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error("Unhandled error on %s: %s", request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Internal server error."},
    )


# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/health", include_in_schema=False)
async def health() -> dict[str, str]:
    return {"status": "ok"}


# ── Favicon — served for the /docs and /redoc browser tabs ───────────────────
# The ICO file lives alongside main.py so the route is self-contained.
# Path(__file__).parent resolves correctly regardless of working directory.

_FAVICON = Path(__file__).parent / "favicon.ico"

@app.get("/favicon.ico", include_in_schema=False)
async def favicon() -> FileResponse:
    return FileResponse(_FAVICON, media_type="image/x-icon")
