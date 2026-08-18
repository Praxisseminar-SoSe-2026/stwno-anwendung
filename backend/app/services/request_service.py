from datetime import datetime

from sqlalchemy.orm import Session

from app.core.permission import get_user_role
from app.models.community_room import CommunityRoom
from app.models.dormitory_facility_manager import DormitoryFacilityManager
from app.models.repair_request import RepairRequest
from app.models.request import Request
from app.models.room_request import RoomRequest
from app.models.user import User
from app.schemas.request import RepairRequestCreate

STAFF_ROLES = {"admin", "mitarbeiter"}


class RequestNotFoundError(Exception):
    pass


class RequestAccessDeniedError(Exception):
    pass


class ResidentWithoutDormitoryError(Exception):
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


def create_repair_request(
    db: Session, current_user: User, payload: RepairRequestCreate
) -> RepairRequest:
    if current_user.dormitory_id is None:
        raise ResidentWithoutDormitoryError(
            "User has no dormitory assigned; cannot create a repair request"
        )

    repair_request = RepairRequest(
        resident_id=current_user.id,
        assigned_dormitory_id=current_user.dormitory_id,
        **payload.model_dump(),
    )
    db.add(repair_request)
    db.commit()
    db.refresh(repair_request)
    return repair_request