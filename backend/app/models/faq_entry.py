from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class FaqEntry(Base):
    __tablename__ = "faq_entries"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    question: Mapped[str]
    answer: Mapped[str] = mapped_column(Text)
    created_by_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"), default=None
    )
    updated_at: Mapped[datetime | None] = mapped_column(default=None)

    created_by: Mapped[User | None] = relationship(back_populates="created_faq_entries")
