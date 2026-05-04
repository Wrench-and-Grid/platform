from __future__ import annotations

import time
from collections import defaultdict

from fastapi import HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address

# Used by main.py for app.state.limiter wiring.
limiter = Limiter(key_func=get_remote_address)

# ── Shared helpers ────────────────────────────────────────────────────────────

def _client_ip(request: Request) -> str:
    """Resolve real client IP, honouring X-Forwarded-For from reverse proxies."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()[:45]
    return (request.client.host if request.client else "unknown")[:45]


def _make_limiter(
    buckets: dict[str, list[float]],
    window: float,
    max_requests: int,
    detail: str,
) -> object:
    """
    Returns a FastAPI Depends-compatible rate-limit coroutine for the given bucket.

    Every CLEANUP_EVERY calls it prunes IPs whose last request fell outside the
    rolling window, preventing unbounded dict growth under sustained diverse traffic.
    """
    _CLEANUP_EVERY = 200
    _count: list[int] = [0]  # mutable cell so the closure can increment it

    async def _limit(request: Request) -> None:
        ip = _client_ip(request)
        now = time.monotonic()
        cutoff = now - window

        bucket = [t for t in buckets[ip] if t > cutoff]
        if len(bucket) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=detail,
            )
        bucket.append(now)
        buckets[ip] = bucket

        _count[0] += 1
        if _count[0] >= _CLEANUP_EVERY:
            _count[0] = 0
            stale = [k for k, v in list(buckets.items()) if not v or v[-1] <= cutoff]
            for k in stale:
                del buckets[k]

    return _limit


# ── Contact — 5 submissions / IP / 60 s ──────────────────────────────────────
# Implemented via Depends rather than @limiter.limit() to avoid the __globals__
# mismatch that occurs when `from __future__ import annotations` turns type hints
# into strings slowapi.extension cannot resolve.

_contact_buckets: dict[str, list[float]] = defaultdict(list)

rate_limit_contact = _make_limiter(
    _contact_buckets,
    window=60.0,
    max_requests=5,
    detail="Too many requests. Please wait a minute before trying again.",
)

# ── Resume download — 10 requests / IP / 60 s ────────────────────────────────

_resume_buckets: dict[str, list[float]] = defaultdict(list)

rate_limit_resume = _make_limiter(
    _resume_buckets,
    window=60.0,
    max_requests=10,
    detail="Too many requests. Please wait before downloading again.",
)
