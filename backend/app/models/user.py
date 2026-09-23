from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy import false as sql_false
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.time import now_utc
from app.db.database import Base

if TYPE_CHECKING:
    from app.models.access_time_slot_history import AccessTimeSlotHistory
    from app.models.announcement import Announcement
    from app.models.consent import Consent
    from app.models.dormitory import Dormitory
    from app.models.dormitory_facility_manager import DormitoryFacilityManager
    from app.models.faq_entry import FaqEntry
    from app.models.item_reservation import ItemReservation
    from app.models.laundry_booking import LaundryBooking
    from app.models.notification import Notification
    from app.models.repair_request_status_history import RepairRequestStatusHistory
    from app.models.request import Request
    from app.models.request_comment import RequestComment
    from app.models.room_request import RoomRequest
    from app.models.room_request_status_history import RoomRequestStatusHistory
    from app.models.user_role import UserRole


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    first_name: Mapped[str]
    last_name: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True, index=True)
    password_hash: Mapped[str | None] = mapped_column(default=None)
    person_number: Mapped[str] = mapped_column(unique=True, index=True)
    flat_number: Mapped[str | None] = mapped_column(default=None)
    contract_end: Mapped[date | None] = mapped_column(default=None)
    language: Mapped[str | None] = mapped_column(default="de", server_default="de")
    is_locked: Mapped[bool | None] = mapped_column(
        default=False, server_default=sql_false()
    )
    locked_at: Mapped[datetime | None] = mapped_column(default=None)
    dormitory_id: Mapped[int | None] = mapped_column(
        ForeignKey("dormitories.id"), default=None
    )
    created_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), default=now_utc
    )

    dormitory: Mapped[Dormitory | None] = relationship(back_populates="residents")
    user_roles: Mapped[list[UserRole]] = relationship(back_populates="user")
    facility_manager_of: Mapped[list[DormitoryFacilityManager]] = relationship(
        back_populates="user"
    )
    requests: Mapped[list[Request]] = relationship(back_populates="resident")
    changed_status_histories: Mapped[list[RepairRequestStatusHistory]] = relationship(
        back_populates="changed_by"
    )
    changed_room_status_histories: Mapped[list[RoomRequestStatusHistory]] = (
        relationship(back_populates="changed_by")
    )
    authored_comments: Mapped[list[RequestComment]] = relationship(
        back_populates="author"
    )
    decided_room_requests: Mapped[list[RoomRequest]] = relationship(
        back_populates="decided_by", foreign_keys="RoomRequest.decided_by_id"
    )
    item_reservations: Mapped[list[ItemReservation]] = relationship(
        back_populates="resident"
    )
    created_faq_entries: Mapped[list[FaqEntry]] = relationship(
        back_populates="created_by"
    )
    changed_access_time_slot_histories: Mapped[list[AccessTimeSlotHistory]] = (
        relationship(back_populates="changed_by")
    )
    authored_announcements: Mapped[list[Announcement]] = relationship(
        back_populates="author"
    )
    # Todo: discuss if this information should be safed and later be accessible
    laundry_bookings: Mapped[list[LaundryBooking]] = relationship(
        back_populates="resident"
    )
    notifications: Mapped[list[Notification]] = relationship(back_populates="user")
    consents: Mapped[list[Consent]] = relationship(back_populates="resident")
