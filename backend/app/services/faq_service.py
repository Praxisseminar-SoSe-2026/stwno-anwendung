from datetime import datetime

from sqlalchemy.orm import Session

from app.models.faq_category import FaqCategory
from app.models.faq_entry import FaqEntry
from app.schemas.faq import FaqEntryCreateRequest, FaqEntryUpdateRequest


class FaqCategoryNotFoundError(Exception):
    pass


class FaqEntryNotFoundError(Exception):
    pass


def list_categories(db: Session) -> list[FaqCategory]:
    categories = db.query(FaqCategory).all()
    return categories


def get_category(db: Session, category_id: int) -> FaqCategory:
    category = db.query(FaqCategory).filter(FaqCategory.id == category_id).first()
    if category is None:
        raise FaqCategoryNotFoundError(f"No category found with this id {category_id}")
    return category


def list_faq_entries(db: Session) -> list[FaqEntry]:
    return db.query(FaqEntry).all()


def get_faq_entry(db: Session, faq_id: int) -> FaqEntry:
    entry = db.query(FaqEntry).filter(FaqEntry.id == faq_id).first()
    if entry is None:
        raise FaqEntryNotFoundError(f"No FAQ entry found with id {faq_id}")
    return entry


# Todo: make current user logging not optional
def create_faq_entry(
    db: Session, payload: FaqEntryCreateRequest, created_by_id: int | None = None
) -> FaqEntry:
    get_category(db, payload.category_id)

    entry = FaqEntry(**payload.model_dump(), created_by_id=created_by_id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def delete_faq_entry(db: Session, faq_id: int) -> None:
    entry = db.query(FaqEntry).filter(FaqEntry.id == faq_id).first()
    if entry is None:
        raise FaqEntryNotFoundError(f"No FAQ entry found with id {faq_id}")

    db.delete(entry)
    db.commit()


def update_faq_entry(
    db: Session, faq_id: int, payload: FaqEntryUpdateRequest
) -> FaqEntry:
    entry = db.query(FaqEntry).filter(FaqEntry.id == faq_id).first()
    if entry is None:
        raise FaqEntryNotFoundError(f"No FAQ entry found with id {faq_id}")

    update_data = payload.model_dump(exclude_unset=True)

    # check if sent category id exists
    if "category_id" in update_data:
        get_category(db, update_data["category_id"])

    for field, value in update_data.items():
        setattr(entry, field, value)

    if update_data:
        entry.updated_at = datetime.now()
        db.commit()
        db.refresh(entry)
    return entry
