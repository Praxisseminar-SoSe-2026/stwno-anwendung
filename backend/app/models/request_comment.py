from __future__ import annotations

from datetime import datetime

from sqlalchemy import ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class RequestComment(Base):
    __tablename__ = "request_comments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    request_id: Mapped[int] = mapped_column(ForeignKey("requests.id"))
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    text: Mapped[str] = mapped_column(Text)
    # Sketch: kein NOT NULL, nur DEFAULT (now()) -> nullable
    created_at: Mapped[datetime | None] = mapped_column(server_default=func.now())

    request: Mapped["Request"] = relationship(back_populates="comments")
    author: Mapped["User"] = relationship(back_populates="authored_comments")
