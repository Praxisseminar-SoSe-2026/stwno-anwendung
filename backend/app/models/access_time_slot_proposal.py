from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.repair_request import RepairRequest


class AccessTimeSlotProposal(Base):
    __tablename__ = "access_time_slot_proposals"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    repair_request_id: Mapped[int] = mapped_column(ForeignKey("repair_requests.id"))
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    repair_request: Mapped[RepairRequest] = relationship(
        back_populates="time_slot_proposals"
    )
