from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.repair_request import RepairRequest


class AccessTimeSlot(Base):
    __tablename__ = "access_time_slots"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    repair_request_id: Mapped[int] = mapped_column(
        ForeignKey("repair_requests.id"), unique=True
    )
    start_time: Mapped[datetime]
    end_time: Mapped[datetime]

    repair_request: Mapped[RepairRequest] = relationship(
        back_populates="access_time_slot"
    )
