from __future__ import annotations

import re

import bleach
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

# No HTML tags are permitted in any text field — strip everything
_ALLOWED_TAGS: list[str] = []
_ALLOWED_ATTRS: dict[str, list[str]] = {}

# Blocks common SQL-injection keyword sequences; not a firewall replacement,
# but a defence-in-depth measure before the ORM's parameterised queries.
_SQL_INJECTION_RE = re.compile(
    r"(--|\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|CAST|DECLARE)\b)",
    re.IGNORECASE,
)

# Permits letters (including Unicode), spaces, hyphens, apostrophes, and dots
_SAFE_NAME_RE = re.compile(r"^[\w\s\-'.]+$", re.UNICODE)


def _sanitise(value: str) -> str:
    """Strip all HTML tags/entities and collapse whitespace."""
    cleaned = bleach.clean(value, tags=_ALLOWED_TAGS, attributes=_ALLOWED_ATTRS, strip=True)
    return " ".join(cleaned.split())


def _reject_sql(value: str, field_name: str) -> str:
    if _SQL_INJECTION_RE.search(value):
        raise ValueError(f"{field_name} contains disallowed content")
    return value


# ── Request ─────────────────────────────────────────────────────────────────

class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120, examples=["Daisy Gonzalez"])
    email: EmailStr = Field(examples=["hello@example.com"])
    subject: str | None = Field(default=None, max_length=200, examples=["Collaboration inquiry"])
    message: str = Field(min_length=10, max_length=4_000, examples=["I'd love to work with you…"])

    # ── Sanitisation — runs first (mode="before") ──────────────────────────

    @field_validator("name", "message", mode="before")
    @classmethod
    def sanitise_required_text(cls, v: object) -> str:
        if not isinstance(v, str):
            raise ValueError("Must be a string")
        return _sanitise(v)

    @field_validator("subject", mode="before")
    @classmethod
    def sanitise_optional_text(cls, v: object) -> str | None:
        if v is None or (isinstance(v, str) and not v.strip()):
            return None
        if not isinstance(v, str):
            raise ValueError("Must be a string")
        return _sanitise(v)

    # ── Business-logic validation — runs after sanitisation ────────────────

    @field_validator("name")
    @classmethod
    def validate_name_chars(cls, v: str) -> str:
        if not _SAFE_NAME_RE.match(v):
            raise ValueError("Name contains invalid characters")
        return _reject_sql(v, "name")

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        return _reject_sql(v, "message")

    @field_validator("subject")
    @classmethod
    def validate_subject(cls, v: str | None) -> str | None:
        if v is None:
            return v
        return _reject_sql(v, "subject")

    @model_validator(mode="after")
    def check_minimum_content(self) -> ContactRequest:
        # Guard against trivially short names after sanitisation
        if len(self.name.strip()) < 2:
            raise ValueError("Name is too short after sanitisation")
        return self


# ── Response ─────────────────────────────────────────────────────────────────

class ContactResponse(BaseModel):
    success: bool
    message: str
    submission_id: int | None = None


class ErrorDetail(BaseModel):
    field: str
    message: str


class ValidationErrorResponse(BaseModel):
    success: bool = False
    errors: list[ErrorDetail]
