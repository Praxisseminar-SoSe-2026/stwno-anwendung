from __future__ import annotations

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Dormitory(Base):
    __tablename__ = "dormitories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str]
    address: Mapped[str | None] = mapped_column(default=None)
    city: Mapped[str | None] = mapped_column(default=None)
    zip_code: Mapped[str | None] = mapped_column(default=None)

    residents: Mapped[list["User"]] = relationship(back_populates="dormitory")
    facility_managers: Mapped[list["DormitoryFacilityManager"]] = relationship(
        back_populates="dormitory"
    )
    community_rooms: Mapped[list["CommunityRoom"]] = relationship(back_populates="dormitory")
    repair_requests: Mapped[list["RepairRequest"]] = relationship(
        back_populates="assigned_dormitory"
    )
    item_types: Mapped[list["ItemType"]] = relationship(back_populates="dormitory")
    wash_rooms: Mapped[list["WashRoom"]] = relationship(back_populates="dormitory")
    announcements: Mapped[list["Announcement"]] = relationship(back_populates="dormitory")
