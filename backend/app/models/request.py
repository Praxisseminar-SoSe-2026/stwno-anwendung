from __future__ import annotations

from datetime import datetime

from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Request(Base):

    __tablename__ = "requests"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    type: Mapped[str]
    resident_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    status: Mapped[str] = mapped_column(default="Offen", server_default="Offen")
    # Sketch: kein NOT NULL, nur DEFAULT (now()) -> nullable
    created_at: Mapped[datetime | None] = mapped_column(server_default=func.now())

    resident: Mapped["User"] = relationship(back_populates="requests")
    comments: Mapped[list["RequestComment"]] = relationship(back_populates="request")

    __mapper_args__ = {
        "polymorphic_identity": "request",
        "polymorphic_on": "type",
    }
