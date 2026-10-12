import logging
from email.message import EmailMessage as MimeEmailMessage

import aiosmtplib

from app.core.config import settings
from app.schemas.email import EmailMessage

logger = logging.getLogger("app.email")


async def send_email(message: EmailMessage) -> None:
    """Send an email via SMTP."""
    mime_message = MimeEmailMessage()
    mime_message["From"] = settings.smtp_from_email
    mime_message["To"] = message.receiver
    mime_message["Subject"] = message.subject
    mime_message.set_content(message.text)

    try:
        await aiosmtplib.send(
            mime_message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_username or None,
            password=settings.smtp_password or None,
            start_tls=settings.smtp_use_tls,
        )
        logger.info("Email sent to %s (subject: %s)", message.receiver, message.subject)
    except Exception:
        logger.exception("Failed to send email to %s", message.receiver)


async def send_emails(messages: list[EmailMessage]) -> None:
    """Send multiple emails via SMTP."""
    for message in messages:
        await send_email(message)
