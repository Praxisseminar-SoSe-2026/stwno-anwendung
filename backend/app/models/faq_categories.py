from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.faq_entry import FaqEntry


class FaqCategory(Base):
    __tablename__ = "faq_categories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(unique=True, index=True)
    questions_entries: Mapped[list[FaqEntry]] = relationship(back_populates="category")
