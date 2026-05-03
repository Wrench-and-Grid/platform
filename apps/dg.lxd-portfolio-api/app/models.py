from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ContactSubmission(Base):
    """Persisted record of every contact-form submission."""

    __tablename__ = "contact_submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)

    # Visitor details — validated and sanitised before insertion
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(254), nullable=False, index=True)
    subject: Mapped[str | None] = mapped_column(String(200), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)

    # Request metadata for audit / abuse detection
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)

    # Timestamps (all UTC)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    # Tracks whether the admin notification email was dispatched successfully
    email_sent: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        return f"<ContactSubmission id={self.id} email={self.email!r}>"
