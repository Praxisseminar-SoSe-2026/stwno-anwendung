from datetime import datetime
from sqlalchemy.orm import Session

from app.core.status import LaundryStatus
from app.models.community_room import CommunityRoom
from app.models.laundry_machine import LaundryMachine
from app.models.laundry_room import LaundryRoom
from app.models.user import User
from app.routers.faq import delete
from app.schemas.laundry import LaundryRoomCreateMachine, LaundryRoomUpdateMachine
from app.services.laundry_booking_service import (
    MachineNotFoundError,
    reset_machine_status_if_expired_or_return_active_booking,
)
from app.services.request_service import ResidentDormitoryError


class LaundryRoomNotFoundError(Exception):
    pass


# Todo: this could be the file for more infrastructure related querys,
#  e.g. rentable cleaning gadgets
def list_community_rooms(db: Session, current_user: User) -> list[CommunityRoom]:
    if current_user.dormitory_id is None:
        raise ResidentDormitoryError(
            "User has no dormitory assigned; cannot list community rooms"
        )
    community_rooms = (
        db.query(CommunityRoom)
        .filter(CommunityRoom.dormitory_id == current_user.dormitory_id)
        .all()
    )

    return community_rooms


def list_laundry_rooms(db: Session, current_user: User) -> list[LaundryRoom]:
    if current_user.dormitory_id is None:
        raise ResidentDormitoryError(
            "User has no dormitory assigned; cannot list laundry rooms"
        )
    laundry_rooms = (
        db.query(LaundryRoom)
        .filter(LaundryRoom.dormitory_id == current_user.dormitory_id)
        .all()
    )

    return laundry_rooms


def list_laundry_machines_in_laundry_room(db: Session,
                                          current_user: User,
                                          laundry_room_id: int) -> list[LaundryMachine]:

    laundry_room = db.get(LaundryRoom, laundry_room_id)
    if laundry_room is None:
        raise LaundryRoomNotFoundError(
            f"Laundry room with id {laundry_room_id} not found"
        )

    if laundry_room.dormitory_id != current_user.dormitory_id:
        raise ResidentDormitoryError(
            "Laundry room does not belong to the resident dormitory"
        )

    machines = (
        db.query(LaundryMachine)
        .filter(LaundryMachine.laundry_room_id == laundry_room_id)
        .all()
    )

    for machine in machines:
        if machine.status == LaundryStatus.OCCUPIED:
            active_booking = reset_machine_status_if_expired_or_return_active_booking(
                db,
                machine.id
            )
            if active_booking is not None:
                machine.occupied_until = active_booking.ends_at
                machine.current_booking_id = active_booking.id
                if current_user.id == active_booking.resident_id:
                    machine.is_own_booking = True
                else:
                    machine.is_own_booking = False

    return machines


def get_laundry_machine(db: Session,
                        current_user: User,
                        laundry_machine_id: int) -> LaundryMachine:
    laundry_machine = db.get(LaundryMachine, laundry_machine_id)
    if laundry_machine is None:
        raise MachineNotFoundError(f"Laundry Machine {laundry_machine_id} not found")

    if laundry_machine.laundry_room.dormitory_id != current_user.dormitory_id:
        raise ResidentDormitoryError(
            "Laundry room with that laundry machine does not belong "
            "to the resident dormitory"
        )

    if laundry_machine.status == LaundryStatus.OCCUPIED:
        active_booking = reset_machine_status_if_expired_or_return_active_booking(
            db,
            laundry_machine.id
        )
        if active_booking is not None:
            laundry_machine.occupied_until = active_booking.ends_at
            laundry_machine.current_booking_id = active_booking.id
            if current_user.id == active_booking.resident_id:
                laundry_machine.is_own_booking = True
            else:
                laundry_machine.is_own_booking = False
    return laundry_machine


def create_laundry_machine(
    db: Session,
    payload: LaundryRoomCreateMachine,
) -> LaundryMachine:
    entry = LaundryMachine(
        label=f"Maschine {payload.id}",
        laundry_room_id=payload.laundry_room_id,
        type=payload.type,
        status=payload.status
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def delete_laundry_machine(db: Session, machine_id: int) -> None:
    entry = db.query(LaundryMachine).filter(LaundryMachine.id == machine_id).first()
    db.delete(entry)
    db.commit()


def update_laundry_machine(db: Session, machine_id: int, payload: LaundryRoomUpdateMachine
                           )-> LaundryMachine:
    entry = db.query(LaundryMachine).filter(LaundryMachine.id == machine_id).first()

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(entry, field, value)

    if update_data:
        entry.updated_at = datetime.now()
        db.commit()
        db.refresh(entry)
    return entry
