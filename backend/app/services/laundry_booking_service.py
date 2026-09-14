from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.status import LaundryStatus
from app.models.laundry_booking import LaundryBooking
from app.models.laundry_machine import LaundryMachine
from app.models.user import User
from app.schemas.laundry import LaundryBookingCreate
from app.services.request_service import ResidentDormitoryError


class MachineNotFoundError(Exception):
    pass


class LaundryBookingTimeConflictError(Exception):
    pass


class BookingNotFoundError(Exception):
    pass


class NotOriginalBookerError(Exception):
    pass


class BookingAlreadyEndedError(Exception):
    pass


# Todo: check for false durations (negative numbers, etc.)
def create_laundry_booking(db: Session,
                           current_user: User,
                           payload: LaundryBookingCreate) -> LaundryBooking:
    now = datetime.now()
    if current_user.dormitory_id is None:
        raise ResidentDormitoryError(
            "User has no dormitory assigned; cannot book a laundry machine"
        )

    machine = db.get(LaundryMachine, payload.laundry_machine_id)
    if machine is None:
        raise MachineNotFoundError(
            f"Machine with id {payload.laundry_machine_id} not found"
        )

    if machine.laundry_room.dormitory_id != current_user.dormitory_id:
        raise ResidentDormitoryError(
            "Machine is in a laundry room, "
            "that does not belong to the resident dormitory"
        )

    time_conflict = (
        db.query(LaundryBooking)
        .filter(
            LaundryBooking.laundry_machine_id == machine.id,
            LaundryBooking.cancelled_at.is_(None),
            LaundryBooking.ends_at > now,
        )
        .first()
    )

    if time_conflict is not None:
        raise LaundryBookingTimeConflictError(
            "Laundry machine is already booked"
        )

    laundry_booking = LaundryBooking(
        resident_id=current_user.id,
        laundry_machine_id=machine.id,
        ends_at=now + timedelta(minutes=payload.duration),
    )

    machine.status = LaundryStatus.OCCUPIED

    db.add(laundry_booking)
    db.commit()
    db.refresh(laundry_booking)
    return laundry_booking


def end_laundry_booking(db: Session,
                        current_user: User,
                        laundry_booking_id: int) -> LaundryBooking:
    booking = db.get(LaundryBooking, laundry_booking_id)

    now = datetime.now()

    if booking is None:
        raise BookingNotFoundError(
            f"Booking with id {laundry_booking_id} not found"
        )

    if not booking.resident_id == current_user.id:
        raise NotOriginalBookerError(
            "User is not the original booker"
        )

    if booking.cancelled_at is not None:
        raise BookingAlreadyEndedError(
            f"Booking with id {laundry_booking_id} already ended"
        )

    if booking.ends_at <= now:
        raise BookingAlreadyEndedError(
            f"Booking with id {laundry_booking_id} already ended"
        )

    booking.cancelled_at = now
    booking.laundry_machine.status = LaundryStatus.FREE

    db.commit()
    db.refresh(booking)
    return booking


def reset_machine_status_if_expired_or_return_active_booking(db: Session,
                                                             laundry_machine_id: int) -> LaundryBooking | None:

    active_booking = (
        db.query(LaundryBooking)
        .filter(
            LaundryBooking.laundry_machine_id == laundry_machine_id,
            LaundryBooking.cancelled_at.is_(None),
            LaundryBooking.ends_at > datetime.now(),
            )
        .first()
    )

    if active_booking is not None:
        return active_booking

    machine = db.get(LaundryMachine, laundry_machine_id)
    if machine is not None and machine.status == LaundryStatus.OCCUPIED:
        machine.status = LaundryStatus.FREE
        db.commit()

    return None
