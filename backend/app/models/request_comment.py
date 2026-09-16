from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Text, func, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.core.time import now_utc

if TYPE_CHECKING:
    from app.models.request import Request
    from app.models.user import User


class RequestComment(Base):
    __tablename__ = "request_comments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    request_id: Mapped[int] = mapped_column(ForeignKey("requests.id"))
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    text: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=now_utc)

    request: Mapped[Request] = relationship(back_populates="comments")
    author: Mapped[User] = relationship(back_populates="authored_comments")
