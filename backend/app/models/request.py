from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.status import RequestStatus
from app.db.database import Base

if TYPE_CHECKING:
    from app.models.request_comment import RequestComment
    from app.models.user import User


class Request(Base):

    __tablename__ = "requests"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    type: Mapped[str]
    resident_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    status: Mapped[RequestStatus] = mapped_column(
        Enum(RequestStatus), default=RequestStatus.OPEN, server_default="OPEN"
    )
    created_at: Mapped[datetime | None] = mapped_column(server_default=func.now())

    resident: Mapped[User] = relationship(back_populates="requests")
    comments: Mapped[list[RequestComment]] = relationship(back_populates="request")

    __mapper_args__ = {
        "polymorphic_identity": "request",
        "polymorphic_on": "type",
    }
