from datetime import UTC, datetime, time, timedelta

from sqlalchemy.orm import Session

from app.core.permission import get_user_role
from app.core.time import now_utc
from app.models import RoomRequestStatusHistory
from app.models.access_time_slot import AccessTimeSlot
from app.models.access_time_slot_history import AccessTimeSlotHistory
from app.models.access_time_slot_proposal import AccessTimeSlotProposal
from app.models.community_room import CommunityRoom
from app.models.dormitory_facility_manager import DormitoryFacilityManager
from app.models.repair_request import RepairRequest
from app.models.repair_request_status_history import RepairRequestStatusHistory
from app.models.request import Request
from app.models.request_comment import RequestComment
from app.models.room_request import RoomRequest
from app.models.user import User
from app.schemas.request import (
    AccessTimeSlotSelect,
    CommentCreate,
    RepairRequestCreate,
    RequestStatusUpdate,
    RoomBookings,
    RoomRequestCreate,
)

STAFF_ROLES = {"admin", "mitarbeiter"}

BUSINESS_HOURS_START = time(8, 0)
BUSINESS_HOURS_END = time(16, 0)
MIN_TIME_SLOT_PROPOSALS = 3
TIME_SLOT_DURATION = timedelta(hours=1)


class RequestNotFoundError(Exception):
    pass


class RequestAccessDeniedError(Exception):
    pass


class ResidentWithoutDormitoryError(Exception):
    pass


class InvalidTimeSlotProposalError(Exception):
    pass


class ResidentDormitoryError(Exception):
    pass


class RoomBookingTimeConflictError(Exception):
    pass


class KeyExchangeDateMissingError(Exception):
    pass


class KeyExchangeDateAfterBookingError(Exception):
    pass


class DateInPastError(Exception):
    pass


class RoomNotFoundError(Exception):
    pass


class TimeSlotProposalNotFoundError(Exception):
    pass


def managed_dormitory_ids(db: Session, user_id: int) -> list[int]:
    rows = (
        db.query(DormitoryFacilityManager.dormitory_id)
        .filter(DormitoryFacilityManager.user_id == user_id)
        .all()
    )
    return [dormitory_id for (dormitory_id,) in rows]


def can_edit_repair_request(
    db: Session, user: User, repair_request: RepairRequest
) -> bool:
    roles = set(get_user_role(db, user.id))

    if roles & STAFF_ROLES:
        return True

    if "hausmeister" in roles:
        return repair_request.assigned_dormitory_id in managed_dormitory_ids(
            db, user.id
        )

    return False


def can_edit_room_request(db: Session, user: User, room_request: RoomRequest) -> bool:
    roles = set(get_user_role(db, user.id))

    if roles & STAFF_ROLES:
        return True

    if "hausmeister" in roles:
        dormitory_id = room_request.community_room.dormitory_id
        return dormitory_id in managed_dormitory_ids(db, user.id)

    return False


def can_edit_request(db: Session, user: User, request: Request) -> bool:
    if isinstance(request, RepairRequest):
        return can_edit_repair_request(db, user, request)

    if isinstance(request, RoomRequest):
        return can_edit_room_request(db, user, request)

    roles = set(get_user_role(db, user.id))
    return bool(roles & STAFF_ROLES)


def list_requests(db: Session, current_user: User) -> list[Request]:
    roles = set(get_user_role(db, current_user.id))

    if roles & STAFF_ROLES:
        return db.query(Request).order_by(Request.created_at.desc()).all()

    if "hausmeister" in roles:
        dormitory_ids = managed_dormitory_ids(db, current_user.id)
        if not dormitory_ids:
            return []

        repairs = (
            db.query(RepairRequest)
            .filter(RepairRequest.assigned_dormitory_id.in_(dormitory_ids))
            .all()
        )
        rooms = (
            db.query(RoomRequest)
            .join(CommunityRoom, RoomRequest.community_room_id == CommunityRoom.id)
            .filter(CommunityRoom.dormitory_id.in_(dormitory_ids))
            .all()
        )
        combined = [*repairs, *rooms]
        combined.sort(
            key=lambda r: r.created_at or datetime.min.replace(tzinfo=UTC), reverse=True
        )
        return combined

    # Default: residents only see their own requests
    return (
        db.query(Request)
        .filter(Request.resident_id == current_user.id)
        .order_by(Request.created_at.desc())
        .all()
    )


def get_request(db: Session, request_id: int, current_user: User) -> Request:
    request = db.get(Request, request_id)
    if request is None:
        raise RequestNotFoundError(f"Request {request_id} not found")

    roles = set(get_user_role(db, current_user.id))

    if roles & STAFF_ROLES:
        return request

    if "hausmeister" in roles:
        dormitory_ids = managed_dormitory_ids(db, current_user.id)
        if (
            isinstance(request, RepairRequest)
            and request.assigned_dormitory_id in dormitory_ids
        ):
            return request
        if isinstance(request, RoomRequest):
            room = request.community_room
            if room and room.dormitory_id in dormitory_ids:
                return request
        raise RequestAccessDeniedError("Not authorized to view this request")

    if request.resident_id == current_user.id:
        return request

    raise RequestAccessDeniedError("Not authorized to view this request")


def _validate_time_slot_proposal(start_time: datetime) -> None:
    if start_time <= now_utc():
        raise InvalidTimeSlotProposalError("Proposed time slots must be in the future")
    if start_time.weekday() > 4:
        raise InvalidTimeSlotProposalError(
            "Proposed time slots must be on a weekday (Monday-Friday)"
        )
    slot_end = start_time + TIME_SLOT_DURATION
    if not (
        BUSINESS_HOURS_START <= start_time.time()
        and slot_end.time() <= BUSINESS_HOURS_END
    ):
        raise InvalidTimeSlotProposalError(
            "Proposed time slots must be within business hours (08:00-16:00)"
        )


def create_repair_request(
    db: Session, current_user: User, payload: RepairRequestCreate
) -> RepairRequest:
    if current_user.dormitory_id is None:
        raise ResidentWithoutDormitoryError(
            "User has no dormitory assigned; cannot create a repair request"
        )

    has_note = bool(payload.proposed_date_note and payload.proposed_date_note.strip())
    needs_time_slots = not payload.entry_permission and not has_note

    if needs_time_slots:
        if len(payload.proposed_time_slots) < MIN_TIME_SLOT_PROPOSALS:
            raise InvalidTimeSlotProposalError(
                f"At least {MIN_TIME_SLOT_PROPOSALS} proposed time slots or a "
                "proposed date note are required when entry permission is not given"
            )
        for slot in payload.proposed_time_slots:
            _validate_time_slot_proposal(slot.start_time)

    repair_request = RepairRequest(
        resident_id=current_user.id,
        assigned_dormitory_id=current_user.dormitory_id,
        **payload.model_dump(exclude={"proposed_time_slots"}),
    )
    db.add(repair_request)
    db.flush()

    if needs_time_slots:
        for slot in payload.proposed_time_slots:
            db.add(
                AccessTimeSlotProposal(
                    repair_request_id=repair_request.id,
                    start_time=slot.start_time,
                    end_time=slot.start_time + TIME_SLOT_DURATION,
                )
            )

    db.commit()
    db.refresh(repair_request)
    return repair_request


def create_room_request(
    db: Session, current_user: User, payload: RoomRequestCreate
) -> RoomRequest:
    if current_user.dormitory_id is None:
        raise ResidentDormitoryError(
            "User has no dormitory assigned; cannot create a room request"
        )

    if (
        not payload.regular_key_exchange_possible
        and not payload.alternative_key_exchange_date
    ):
        raise KeyExchangeDateMissingError("Alternative key exchange date is missing")

    if (
        not payload.regular_key_exchange_possible
        and payload.alternative_key_exchange_date < now_utc().today()
    ):
        raise DateInPastError("Date can not be in the past")

    community_room = db.get(CommunityRoom, payload.community_room_id)
    if community_room is None:
        raise RoomNotFoundError(
            f"Community room with id {payload.community_room_id} not found"
        )

    if current_user.dormitory_id != community_room.dormitory_id:
        raise ResidentDormitoryError(
            "User has different dormitory assigned, than community room"
        )

    first_booked_day = payload.start_date
    last_booked_day = payload.end_date

    if first_booked_day > last_booked_day:
        raise RoomBookingTimeConflictError("Start date must be before end date")

    if first_booked_day < now_utc().today():
        raise DateInPastError("Date can not be in the past")

    # check if booking is on weekend to book whole weekend, made with tutorial [https://www.geeksforgeeks.org/python/weekday-function-of-datetime-date-class-in-python/]
    if first_booked_day.weekday() >= 4:
        friday = first_booked_day - timedelta(days=first_booked_day.weekday() - 4)
        first_booked_day = friday
        last_booked_day = friday + timedelta(days=2)
    # check if maximal 2 days are booked in a row (except for weekends)
    elif (last_booked_day - first_booked_day).days >= 2:
        raise RoomBookingTimeConflictError(
            "Bookings outside the weekend cant be longer than 2 days"
        )

    if (
        not payload.regular_key_exchange_possible
        and payload.alternative_key_exchange_date > first_booked_day
    ):
        raise KeyExchangeDateAfterBookingError(
            "Key exchange can not happen after first day of booking"
        )

    first_booked_day_datetime = datetime.combine(
        first_booked_day, datetime.min.time().replace(tzinfo=UTC)
    )
    last_booked_day_datetime = datetime.combine(
        last_booked_day, datetime.max.time().replace(tzinfo=UTC)
    )

    alternative_key_exchange_datetime = (
        datetime.combine(
            payload.alternative_key_exchange_date,
            datetime.min.time().replace(tzinfo=UTC),
        )
        if payload.alternative_key_exchange_date is not None
        else None
    )

    # Todo: time conflict should only affect accepted booking requests
    time_conflict = (
        db.query(RoomRequest)
        .filter(
            RoomRequest.community_room_id == payload.community_room_id,
            RoomRequest.start_datetime <= last_booked_day_datetime,
            RoomRequest.end_datetime >= first_booked_day_datetime,
        )
        .first()
    )

    if time_conflict is not None:
        raise RoomBookingTimeConflictError(
            "Community room is already booked for this timeslot"
        )

    room_request = RoomRequest(
        resident_id=current_user.id,
        community_room_id=payload.community_room_id,
        start_datetime=first_booked_day_datetime,
        end_datetime=last_booked_day_datetime,
        regular_key_exchange_possible=payload.regular_key_exchange_possible,
        alternative_key_exchange_date=alternative_key_exchange_datetime,
    )

    db.add(room_request)
    db.commit()
    db.refresh(room_request)
    return room_request


def edit_room_request(
    db: Session, request_id: int, current_user: User, payload: RequestStatusUpdate
) -> RoomRequest:
    room_request = db.get(RoomRequest, request_id)
    if room_request is None:
        raise RequestNotFoundError(f"Request {request_id} not found")

    if not can_edit_room_request(db, current_user, room_request):
        raise RequestAccessDeniedError("Not authorized to edit this request")

    room_request.status = payload.status
    room_request.decided_by_id = current_user.id
    room_request.decided_at = now_utc()

    db.add(
        RoomRequestStatusHistory(
            room_request_id=room_request.id,
            status=payload.status,
            changed_by_id=current_user.id,
        )
    )

    db.commit()
    db.refresh(room_request)
    return room_request


# Todo: staff should be able to look at these kind of information
#  (independent of having a dormitory assigned)
def list_room_bookings(db: Session, current_user: User) -> list[RoomBookings]:
    roles = set(get_user_role(db, current_user.id))

    if roles & STAFF_ROLES:
        room_requests = (
            db.query(RoomRequest)
            .join(CommunityRoom, RoomRequest.community_room_id == CommunityRoom.id)
            .all()
        )

        # TODO: move this redundancy in separate function
        return [
            RoomBookings(
                id=room_request.id,
                community_room_id=room_request.community_room_id,
                dormitory_id=room_request.community_room.dormitory_id,
                start_datetime=room_request.start_datetime,
                end_datetime=room_request.end_datetime,
                status=room_request.status,
            )
            for room_request in room_requests
        ]

    if "hausmeister" in roles:
        dormitory_ids = managed_dormitory_ids(db, current_user.id)
        if not dormitory_ids:
            return []
        room_requests = (
            db.query(RoomRequest)
            .join(CommunityRoom, RoomRequest.community_room_id == CommunityRoom.id)
            .filter(CommunityRoom.dormitory_id.in_(dormitory_ids))
            .all()
        )

        return [
            RoomBookings(
                id=room_request.id,
                community_room_id=room_request.community_room_id,
                dormitory_id=room_request.community_room.dormitory_id,
                start_datetime=room_request.start_datetime,
                end_datetime=room_request.end_datetime,
                status=room_request.status,
            )
            for room_request in room_requests
        ]

    if current_user.dormitory_id is None:
        raise ResidentDormitoryError(
            "User has no dormitory assigned; cannot list room availability"
        )

    room_requests = (
        db.query(RoomRequest)
        .join(CommunityRoom, RoomRequest.community_room_id == CommunityRoom.id)
        .filter(CommunityRoom.dormitory_id == current_user.dormitory_id)
        .all()
    )

    return [
        RoomBookings(
            id=room_request.id,
            community_room_id=room_request.community_room_id,
            dormitory_id=current_user.dormitory_id,
            start_datetime=room_request.start_datetime,
            end_datetime=room_request.end_datetime,
            status=room_request.status,
        )
        for room_request in room_requests
    ]


def update_repair_status(
    db: Session,
    request_id: int,
    current_user: User,
    payload: RequestStatusUpdate,
) -> RepairRequest:
    repair_request = db.get(RepairRequest, request_id)
    if repair_request is None:
        raise RequestNotFoundError(f"Request {request_id} not found")

    if not can_edit_repair_request(db, current_user, repair_request):
        raise RequestAccessDeniedError("Not authorized to edit this request")

    repair_request.status = payload.status
    db.add(
        RepairRequestStatusHistory(
            repair_request_id=repair_request.id,
            status=payload.status,
            changed_by_id=current_user.id,
        )
    )

    db.commit()
    db.refresh(repair_request)
    return repair_request


def set_access_time_slot(
    db: Session,
    request_id: int,
    current_user: User,
    payload: AccessTimeSlotSelect,
) -> RepairRequest:
    repair_request = db.get(RepairRequest, request_id)
    if repair_request is None:
        raise RequestNotFoundError(f"Request {request_id} not found")

    if not can_edit_repair_request(db, current_user, repair_request):
        raise RequestAccessDeniedError("Not authorized to edit this request")

    proposal = next(
        (
            slot
            for slot in repair_request.time_slot_proposals
            if slot.id == payload.time_slot_proposal_id
        ),
        None,
    )
    if proposal is None:
        raise TimeSlotProposalNotFoundError(
            f"Time slot proposal {payload.time_slot_proposal_id} not found "
            "for this request"
        )

    if repair_request.access_time_slot is None:
        repair_request.access_time_slot = AccessTimeSlot(
            repair_request_id=repair_request.id,
            start_time=proposal.start_time,
            end_time=proposal.end_time,
        )
    else:
        repair_request.access_time_slot.start_time = proposal.start_time
        repair_request.access_time_slot.end_time = proposal.end_time

    db.add(
        AccessTimeSlotHistory(
            repair_request_id=repair_request.id,
            start_time=proposal.start_time,
            end_time=proposal.end_time,
            changed_by_id=current_user.id,
        )
    )

    db.commit()
    db.refresh(repair_request)
    return repair_request


def add_comment(
    db: Session,
    request_id: int,
    current_user: User,
    payload: CommentCreate,
) -> Request:
    request = db.get(Request, request_id)
    if request is None:
        raise RequestNotFoundError(f"Request {request_id} not found")

    if not can_edit_request(db, current_user, request):
        raise RequestAccessDeniedError("Not authorized to comment on this request")

    db.add(
        RequestComment(
            request_id=request.id,
            author_id=current_user.id,
            text=payload.text,
        )
    )

    db.commit()
    db.refresh(request)
    return request
