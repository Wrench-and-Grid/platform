import time
from collections import defaultdict

from fastapi import HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address

# Used by main.py for app.state.limiter + RateLimitExceeded handler wiring.
limiter = Limiter(key_func=get_remote_address)

# ── Contact endpoint rate limit ───────────────────────────────────────────────
# Implemented as a FastAPI Depends rather than @limiter.limit() to avoid the
# __globals__ mismatch that occurs when from __future__ import annotations turns
# type hints into strings that can't be resolved in slowapi.extension's scope.

_buckets: dict[str, list[float]] = defaultdict(list)
_WINDOW = 60.0   # seconds
_MAX    = 5      # requests per window per IP


async def rate_limit_contact(request: Request) -> None:
    """Allow 5 contact submissions per IP per 60-second rolling window."""
    ip = (request.client.host if request.client else "unknown")[:45]
    now    = time.monotonic()
    cutoff = now - _WINDOW
    bucket = [t for t in _buckets[ip] if t > cutoff]
    if len(bucket) >= _MAX:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please wait a minute before trying again.",
        )
    bucket.append(now)
    _buckets[ip] = bucket
