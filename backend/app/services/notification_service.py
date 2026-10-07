import logging
from zoneinfo import ZoneInfo

from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import User, Request, RepairRequest, UserRole, Role, Announcement
from app.schemas.email import EmailMessage

logger = logging.getLogger("app.notification_service")

DEFAULT_LANGUAGE = "de"
LOCAL_TIMEZONE = ZoneInfo("Europe/Berlin")

TEXTS = {
    "de": {
        "request_type": {"repair": "Reparaturanfrage", "room": "Raumbuchungsanfrage"},
        "status": {
            "open": "Offen",
            "in_progress": "In Bearbeitung",
            "closed": "Geschlossen",
            "denied": "Abgelehnt",
        },
        "greeting": "Hallo {name}",
        "signature": "Viele Grüße,\nDein Studentenwerk-Team",
        "status_subject": "Ticket #{id}: Status geändert",
        "status_body": 'der Status deiner {type} #{id} wurde auf "{status}" geändert.',
        "comment_subject": "Ticket #{id}: Neuer Kommentar",
        "comment_body": "{author} hat deine {type} #{id} kommentiert:\n\n{comment}",
        "entry_time_subject": "Ticket #{id}: Zutrittstermin festgelegt",
        "entry_time_body": (
            "für deine {type} #{id} wurde der Zutrittstermin festgelegt:\n\n{slot} Uhr"
        ),
        "announcement_subject": "Neue Ankündigung: {title}",
        "announcement_subject_important": "Wichtige Ankündigung: {title}",
        "announcement_body": (
            "es gibt eine neue Ankündigung:\n\n{title}\n\n{text}"
        ),
    },
    "en": {
        "request_type": {"repair": "repair request", "room": "room booking request"},
        "status": {
            "open": "Open",
            "in_progress": "In progress",
            "closed": "Closed",
            "denied": "Denied",
        },
        "greeting": "Hi {name},",
        "signature": "Best regards\nYour Studentenwerk team",
        "status_subject": "Ticket #{id}: status changed",
        "status_body": 'the status of your {type} #{id} was changed to "{status}".',
        "comment_subject": "Ticket #{id}: new comment",
        "comment_body": "{author} commented on your {type} #{id}:\n\n{comment}",
        "entry_time_subject": "Ticket #{id}: entry time set",
        "entry_time_body": (
            "the entry time for your {type} #{id} was set to:\n\n{slot}"
        ),
        "announcement_subject": "New announcement: {title}",
        "announcement_subject_important": "Important announcement: {title}",
        "announcement_body": (
            "there is a new announcement:\n\n{title}\n\n{text}\n\n"
        ),
    }
}


def _texts(user: User) -> dict:
    return TEXTS.get(user.language or DEFAULT_LANGUAGE, TEXTS[DEFAULT_LANGUAGE])


def _compose(user: User, subject: str, body: str) -> list[EmailMessage]:
    """Build one mail for a user; returns [] if the address is unusable."""
    texts = _texts(user)
    text = (
        f"{texts['greeting'].format(name=user.first_name)}\n\n"
        f"{body}\n\n{texts['signature']}"
    )
    try:
        return [
            EmailMessage(
                receiver=user.email,
                # collapse whitespace/newlines to prevent header problems
                subject= " ".join(subject.split()),
                text=text,
            )
        ]
    except ValidationError:
        logger.warning("Skipping notification for user %s: invalid email", user.id)
        return []


def _format_slot(start, end) -> str:
    start_local = start.astimezone(LOCAL_TIMEZONE)
    end_local = end.astimezone(LOCAL_TIMEZONE)
    return f"{start_local:%d.%m.%Y}, {start_local:%H:%M}-{end_local:%H:%M}"


def request_status_changed_emails(request: Request, actor: User) -> list[EmailMessage]:
    resident = request.resident
    if resident.id == actor.id:
        return []

    texts = _texts(resident)
    return _compose(
        resident,
        texts["status_subject"].format(id=request.id),
        texts["status_body"].format(
            type=texts["request_type"][request.type],
            id=request.id,
            status=texts["status"][request.status.value],
        ),
    )


def request_comment_added_emails(
        request: Request, actor: User, comment_text: str
) -> list[EmailMessage]:
    resident = request.resident
    if resident.id == actor.id:
        return []

    texts = _texts(resident)
    return _compose(
        resident,
        texts["comment_subject"].format(id=request.id),
        texts["comment_body"].format(
            author=f"{actor.first_name} {actor.last_name}",
            type=texts["request_type"][request.type],
            id=request.id,
            comment=comment_text,
        ),
    )


def request_entry_time_set_emails(
    request: RepairRequest, actor: User
) -> list[EmailMessage]:
    resident = request.resident
    slot = request.access_time_slot
    if resident.id == actor.id or slot is None:
        return []

    texts = _texts(resident)
    return _compose(
        resident,
        texts["entry_time_subject"].format(id=request.id),
        texts["entry_time_body"].format(
            type=texts["request_type"][request.type],
            id=request.id,
            slot=_format_slot(slot.start_time, slot.end_time),
        ),
    )


def _resident_recipients(db: Session, dormitory_id: int | None) -> list[User]:
    query = (
        db.query(User)
        .join(UserRole, UserRole.user_id == User.id)
        .join(Role, Role.id == UserRole.role_id)
        .filter(Role.name == "bewohner")
        .filter(User.is_locked.is_not(True))
    )
    # dormitory_id None = announcement is meant for all dormitories
    if dormitory_id is not None:
        query = query.filter(User.dormitory_id == dormitory_id)
    return query.all()


def announcement_emails(db: Session, announcement: Announcement) -> list[EmailMessage]:
    link = f"{settings.frontend_url.rstrip('/')}/aushang/{announcement.id}"
    subject_key = (
        "announcement_subject_important"
        if announcement.important
        else "announcement_subject"
    )

    messages: list[EmailMessage] = []
    for resident in _resident_recipients(db, announcement.dormitory_id):
        texts = _texts(resident)
        messages += _compose(
            resident,
            texts[subject_key].format(title=announcement.title),
            texts["announcement_body"].format(
                title=announcement.title, text=announcement.text, link=link
            ),
        )
    return messages