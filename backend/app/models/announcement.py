from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Text
from sqlalchemy import false as sql_false
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.time import now_utc
from app.db.database import Base

if TYPE_CHECKING:
    from app.models.dormitory import Dormitory
    from app.models.user import User


class Announcement(Base):
    __tablename__ = "announcements"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str]
    text: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(default=None)
    important: Mapped[bool | None] = mapped_column(
        default=False, server_default=sql_false()
    )
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    dormitory_id: Mapped[int | None] = mapped_column(
        ForeignKey("dormitories.id"), default=None
    )
    # Sketch: kein NOT NULL, nur DEFAULT (now()) -> nullable
    created_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), default=now_utc
    )

    author: Mapped[User] = relationship(back_populates="authored_announcements")
    dormitory: Mapped[Dormitory | None] = relationship(back_populates="announcements")
