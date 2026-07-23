from __future__ import annotations

from datetime import datetime

from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Consent(Base):


    __tablename__ = "consents"

    id: Mapped[int] = mapped_column(ForeignKey("repair_requests.id"), primary_key=True)
    resident_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    consent_given: Mapped[bool]
    consent_text_version: Mapped[str]
    # Sketch: kein NOT NULL, nur DEFAULT (now()) -> nullable
    timestamp: Mapped[datetime | None] = mapped_column(server_default=func.now())

    repair_request: Mapped["RepairRequest"] = relationship(back_populates="consent")
    resident: Mapped["User"] = relationship(back_populates="consents")
