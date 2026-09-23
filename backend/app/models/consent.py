from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.time import now_utc
from app.db.database import Base

if TYPE_CHECKING:
    from app.models.repair_request import RepairRequest
    from app.models.user import User


class Consent(Base):

    __tablename__ = "consents"

    id: Mapped[int] = mapped_column(ForeignKey("repair_requests.id"), primary_key=True)
    resident_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    consent_given: Mapped[bool]
    consent_text_version: Mapped[str]
    # Sketch: kein NOT NULL, nur DEFAULT (now()) -> nullable
    timestamp: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), default=now_utc
    )

    repair_request: Mapped[RepairRequest] = relationship(back_populates="consent")
    resident: Mapped[User] = relationship(back_populates="consents")
