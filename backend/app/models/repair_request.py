from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Text
from sqlalchemy import false as sql_false
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.request import Request

if TYPE_CHECKING:
    from app.models.access_time_slot import AccessTimeSlot
    from app.models.consent import Consent
    from app.models.dormitory import Dormitory
    from app.models.repair_request_status_history import RepairRequestStatusHistory


class RepairRequest(Request):

    __tablename__ = "repair_requests"

    id: Mapped[int] = mapped_column(ForeignKey("requests.id"), primary_key=True)
    description: Mapped[str] = mapped_column(Text)
    location: Mapped[str]
    image_url: Mapped[str | None] = mapped_column(default=None)
    entry_permission: Mapped[bool | None] = mapped_column(
        default=False, server_default=sql_false()
    )
    assigned_dormitory_id: Mapped[int | None] = mapped_column(
        ForeignKey("dormitories.id"), default=None
    )

    assigned_dormitory: Mapped[Dormitory | None] = relationship(
        back_populates="repair_requests"
    )
    access_time_slot: Mapped[AccessTimeSlot | None] = relationship(
        back_populates="repair_request", uselist=False
    )
    status_history: Mapped[list[RepairRequestStatusHistory]] = relationship(
        back_populates="repair_request"
    )
    consent: Mapped[Consent | None] = relationship(
        back_populates="repair_request", uselist=False
    )

    __mapper_args__ = {"polymorphic_identity": "repair"}
