from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.request import RequestResponse, RoomRequestCreate, RoomRequestStatusUpdate, RoomBookings
from app.services.request_service import (
    RequestAccessDeniedError,
    RequestNotFoundError,
    ResidentDormitoryError,
    RoomNotFoundError,
    RoomBookingTimeConflictError,
    KeyExchangeDateMissingError,
    get_request,
    list_requests,
    create_room_request,
    edit_room_request,
    list_room_bookings
)

router = APIRouter(prefix="/requests", tags=["requests"])


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

    return RequestResponse.from_request(room_request)


@router.get("", response_model=list[RequestResponse])
def list_all(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    requests = list_requests(db, current_user)
    return [RequestResponse.from_request(r) for r in requests]


@router.get("/room_booking", response_model=list[RoomBookings])
def list_all_room_booking_requests(
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User, Depends(get_current_user)]
):
    try:
        return list_room_bookings(db, current_user)
    except ResidentDormitoryError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except KeyExchangeDateMissingError as exc:
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

    return RequestResponse.from_request(request)


@router.patch("/room_booking/{request_id}", response_model=RequestResponse)
def edit_room_booking_request(
        request_id: int,
        payload: RoomRequestStatusUpdate,
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
