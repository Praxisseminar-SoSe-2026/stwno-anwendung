from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.announcement import Announcement
    from app.models.community_room import CommunityRoom
    from app.models.dormitory_facility_manager import DormitoryFacilityManager
    from app.models.item_type import ItemType
    from app.models.laundry_room import LaundryRoom
    from app.models.repair_request import RepairRequest
    from app.models.user import User


class Dormitory(Base):
    __tablename__ = "dormitories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str]
    address: Mapped[str | None] = mapped_column(default=None)
    city: Mapped[str | None] = mapped_column(default=None)
    zip_code: Mapped[str | None] = mapped_column(default=None)

    residents: Mapped[list[User]] = relationship(back_populates="dormitory")
    facility_managers: Mapped[list[DormitoryFacilityManager]] = relationship(
        back_populates="dormitory"
    )
    community_rooms: Mapped[list[CommunityRoom]] = relationship(
        back_populates="dormitory"
    )
    repair_requests: Mapped[list[RepairRequest]] = relationship(
        back_populates="assigned_dormitory"
    )
    item_types: Mapped[list[ItemType]] = relationship(back_populates="dormitory")
    laundry_rooms: Mapped[list[LaundryRoom]] = relationship(back_populates="dormitory")
    announcements: Mapped[list[Announcement]] = relationship(back_populates="dormitory")
