from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.request import (
    AccessTimeSlotSelect,
    CommentCreate,
    RepairRequestCreate,
    RequestResponse,
    RequestStatusUpdate,
    RoomBookings,
    RoomRequestCreate,
)
from app.services.request_service import (
    DateInPastError,
    InvalidTimeSlotProposalError,
    KeyExchangeDateAfterBookingError,
    KeyExchangeDateMissingError,
    RequestAccessDeniedError,
    RequestNotFoundError,
    ResidentDormitoryError,
    ResidentWithoutDormitoryError,
    RoomBookingTimeConflictError,
    RoomNotFoundError,
    TimeSlotProposalNotFoundError,
    add_repair_comment,
    can_edit_request,
    create_repair_request,
    create_room_request,
    edit_room_request,
    get_request,
    list_requests,
    list_room_bookings,
    set_access_time_slot,
    update_repair_status,
)

router = APIRouter(prefix="/requests", tags=["requests"])


@router.post("/repair", response_model=RequestResponse, status_code=201)
def create_repair(
    payload: RepairRequestCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        repair_request = create_repair_request(db, current_user, payload)
    except (
        ResidentWithoutDormitoryError,
        InvalidTimeSlotProposalError,
    ) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return RequestResponse.from_request(repair_request)


@router.patch("/repair/{request_id}/status", response_model=RequestResponse)
def update_repair_request_status(
    request_id: int,
    payload: RequestStatusUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        repair_request = update_repair_status(db, request_id, current_user, payload)
    except RequestNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except RequestAccessDeniedError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc

    return RequestResponse.from_request(
        repair_request, can_edit=can_edit_request(db, current_user, repair_request)
    )


@router.post("/repair/{request_id}/entry-time", response_model=RequestResponse)
def select_repair_entry_time(
    request_id: int,
    payload: AccessTimeSlotSelect,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        repair_request = set_access_time_slot(db, request_id, current_user, payload)
    except RequestNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except RequestAccessDeniedError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc
    except TimeSlotProposalNotFoundError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return RequestResponse.from_request(
        repair_request, can_edit=can_edit_request(db, current_user, repair_request)
    )


@router.post("/repair/{request_id}/comments", response_model=RequestResponse)
def add_repair_request_comment(
    request_id: int,
    payload: CommentCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        repair_request = add_repair_comment(db, request_id, current_user, payload)
    except RequestNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except RequestAccessDeniedError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc

    return RequestResponse.from_request(
        repair_request, can_edit=can_edit_request(db, current_user, repair_request)
    )


@router.get("", response_model=list[RequestResponse])
def list_all(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    requests = list_requests(db, current_user)
    return [
        RequestResponse.from_request(r, can_edit=can_edit_request(db, current_user, r))
        for r in requests
    ]


@router.post("/room_booking", response_model=RequestResponse)
def create_room_booking_request(
    payload: RoomRequestCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        room_request = create_room_request(db, current_user, payload)
    except ResidentDormitoryError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RoomNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except RoomBookingTimeConflictError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except KeyExchangeDateMissingError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except KeyExchangeDateAfterBookingError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except DateInPastError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return RequestResponse.from_request(room_request)

@router.get("/room_booking", response_model=list[RoomBookings])
def list_room_booking_availability(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        return list_room_bookings(db, current_user)
    except ResidentDormitoryError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

@router.get("/{request_id}", response_model=RequestResponse)
def get_one(
    request_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        request = get_request(db, request_id, current_user)
    except RequestNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except RequestAccessDeniedError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc

    return RequestResponse.from_request(
        request, can_edit=can_edit_request(db, current_user, request)
    )


@router.patch("/room_booking/{request_id}", response_model=RequestResponse)
def edit_room_booking_request(
    request_id: int,
    payload: RequestStatusUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        room_request = edit_room_request(db, request_id, current_user, payload)
    except RequestAccessDeniedError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc
    except RequestNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return RequestResponse.from_request(room_request)
