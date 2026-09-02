from datetime import UTC, datetime, time, timedelta

from sqlalchemy.orm import Session

from app.core.permission import get_user_role
from app.models.access_time_slot_proposal import AccessTimeSlotProposal
from app.models.community_room import CommunityRoom
from app.models.dormitory_facility_manager import DormitoryFacilityManager
from app.models.repair_request import RepairRequest
from app.models.request import Request
from app.models.room_request import RoomRequest
from app.models.user import User
from app.schemas.request import RepairRequestCreate

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


def managed_dormitory_ids(db: Session, user_id: int) -> list[int]:
    rows = (
        db.query(DormitoryFacilityManager.dormitory_id)
        .filter(DormitoryFacilityManager.user_id == user_id)
        .all()
    )
    return [dormitory_id for (dormitory_id,) in rows]


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
        combined.sort(key=lambda r: r.created_at or datetime.min, reverse=True)
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
    if start_time <= datetime.now(UTC):
        raise InvalidTimeSlotProposalError(
            "Proposed time slots must be in the future"
        )
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

    has_note = bool(
        payload.proposed_date_note and payload.proposed_date_note.strip()
    )
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