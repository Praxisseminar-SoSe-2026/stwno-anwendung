from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, func
from sqlalchemy import false as sql_false
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    type: Mapped[str]
    message: Mapped[str]
    related_entity_type: Mapped[str | None] = mapped_column(default=None)
    related_entity_id: Mapped[int | None] = mapped_column(default=None)
    is_read: Mapped[bool | None] = mapped_column(
        default=False, server_default=sql_false()
    )
    # Sketch: kein NOT NULL, nur DEFAULT (now()) -> nullable
    created_at: Mapped[datetime | None] = mapped_column(server_default=func.now())

    user: Mapped[User] = relationship(back_populates="notifications")
