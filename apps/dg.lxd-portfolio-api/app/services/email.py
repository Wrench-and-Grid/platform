from __future__ import annotations

import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib

from app.config import settings

logger = logging.getLogger(__name__)

# ── Template helpers ──────────────────────────────────────────────────────────

def _plain_body(
    submission_id: int,
    name: str,
    email: str,
    subject: str | None,
    message: str,
) -> str:
    return (
        f"New contact submission  #{submission_id}\n"
        f"{'─' * 40}\n"
        f"Name:    {name}\n"
        f"Email:   {email}\n"
        f"Subject: {subject or '—'}\n\n"
        f"Message:\n{message}\n"
        f"{'─' * 40}\n"
        f"Respond directly by replying to this email.\n"
    )


def _escape(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def _html_body(
    submission_id: int,
    name: str,
    email: str,
    subject: str | None,
    message: str,
) -> str:
    safe_name = _escape(name)
    safe_email = _escape(email)
    safe_subject = _escape(subject) if subject else "—"
    safe_message = _escape(message)
    return f"""
<html><body style="font-family:sans-serif;color:#111010;max-width:600px">
  <h2 style="color:#ff5b22">New contact — #{submission_id}</h2>
  <table cellpadding="8" style="border-collapse:collapse;width:100%">
    <tr><th align="left" style="background:#f7f5f2;width:90px">Name</th>
        <td>{safe_name}</td></tr>
    <tr><th align="left" style="background:#f7f5f2">Email</th>
        <td><a href="mailto:{safe_email}">{safe_email}</a></td></tr>
    <tr><th align="left" style="background:#f7f5f2">Subject</th>
        <td>{safe_subject}</td></tr>
  </table>
  <h3 style="margin-top:1.5rem">Message</h3>
  <p style="white-space:pre-wrap;background:#f7f5f2;padding:1rem">{safe_message}</p>
  <p style="color:#a09890;font-size:.8rem">
    Portfolio API · Reply to this email to respond directly.
  </p>
</body></html>
"""


# ── Public API ────────────────────────────────────────────────────────────────

async def send_admin_notification(
    submission_id: int,
    name: str,
    email: str,
    subject: str | None,
    message: str,
) -> bool:
    """
    Send an HTML + plain-text admin alert for a new contact submission.

    Returns True if the email was dispatched, False if SMTP is not configured
    or if sending fails (the caller decides how to surface that).
    """
    if not settings.email_configured:
        logger.warning(
            "Email service not configured — skipping notification for #%d",
            submission_id,
        )
        return False

    msg = MIMEMultipart("alternative")
    msg["From"] = settings.smtp_user
    msg["To"] = settings.admin_email
    msg["Reply-To"] = email
    msg["Subject"] = f"[Portfolio] New contact from {name} (#{submission_id})"

    msg.attach(MIMEText(_plain_body(submission_id, name, email, subject, message), "plain", "utf-8"))
    msg.attach(MIMEText(_html_body(submission_id, name, email, subject, message), "html", "utf-8"))

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user,
            password=settings.smtp_password,
            start_tls=True,
            timeout=15,
        )
        logger.info("Admin notification sent for submission #%d", submission_id)
        return True

    except aiosmtplib.SMTPException as exc:
        logger.error(
            "SMTP error for submission #%d: %s",
            submission_id,
            exc,
            exc_info=True,
        )
        return False

    except Exception as exc:  # network timeout, DNS failure, etc.
        logger.error(
            "Unexpected email error for submission #%d: %s",
            submission_id,
            exc,
            exc_info=True,
        )
        return False
