from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.faq_categories import FaqCategory
    from app.models.user import User


class FaqEntry(Base):
    __tablename__ = "faq_entries"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    question: Mapped[str]
    category_id: Mapped[int | None] = mapped_column(
        ForeignKey("faq_categories.id"), default=None
    )
    answer: Mapped[str] = mapped_column(Text)
    created_by_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"), default=None
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), default=None
    )

    category: Mapped[FaqCategory | None] = relationship(
        back_populates="questions_entries"
    )
    created_by: Mapped[User | None] = relationship(back_populates="created_faq_entries")
