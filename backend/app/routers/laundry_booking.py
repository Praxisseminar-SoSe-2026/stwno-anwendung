import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.laundry import (
    LaundryBookingCreate,
    LaundryBookingResponse,
)
from app.services.laundry_booking_service import (
    BookingAlreadyEndedError,
    BookingNotFoundError,
    LaundryBookingTimeConflictError,
    MachineNotFoundError,
    NotOriginalBookerError,
    create_laundry_booking,
    end_laundry_booking,
)
from app.services.request_service import ResidentDormitoryError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/laundry", tags=["laundry"])


@router.post("/booking", response_model=LaundryBookingResponse)
def create_booking(
    payload: LaundryBookingCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        return create_laundry_booking(db, current_user, payload)
    except ResidentDormitoryError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except MachineNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except LaundryBookingTimeConflictError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.patch(
    "/booking/{laundry_booking_id}/end", response_model=LaundryBookingResponse
)
def end_booking(
    laundry_booking_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    try:
        return end_laundry_booking(db, current_user, laundry_booking_id)
    except BookingNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except NotOriginalBookerError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except BookingAlreadyEndedError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
