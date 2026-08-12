from sqlalchemy.orm import Session

from app.models.announcement import Announcement
from app.schemas.announcement import AnnouncementCreate, AnnouncementUpdate


class AnnouncementNotFoundError(Exception):
    pass


def create_announcement(db: Session, author_id: int, payload: AnnouncementCreate) \
        -> Announcement:
    announcement = Announcement(author_id=author_id, **payload.model_dump())
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement


def get_announcement(db: Session, announcement_id: int) -> Announcement:
    announcement = db.get(Announcement, announcement_id)
    if announcement is None:
        raise AnnouncementNotFoundError(f"Announcement {announcement_id} not found")
    return announcement


def list_announcements(db: Session) -> list[Announcement]:
    return db.query(Announcement).order_by(Announcement.created_at.desc()).all()


def update_announcement(
    db: Session, announcement_id: int, payload: AnnouncementUpdate
) -> Announcement:
    announcement = get_announcement(db, announcement_id)
    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(announcement, field, value)
    db.commit()
    db.refresh(announcement)
    return announcement


def delete_announcement(db: Session, announcement_id: int) -> None:
    announcement = get_announcement(db, announcement_id)
    db.delete(announcement)
    db.commit()