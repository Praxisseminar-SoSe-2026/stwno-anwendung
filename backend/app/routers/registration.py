import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.registration import RegistrationRequest
from app.schemas.user import UserResponse
from app.services.registration_service import (
    DuplicateRegistrationError,
    InvalidPersonNumberError,
    VerificationFailedError,
    VerificationUnavailableError,
    register_user,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/registration", tags=["registration"])


@router.post("", response_model=UserResponse, status_code=201)
def register(payload: RegistrationRequest, db: Session = Depends(get_db)):
    try:
        user = register_user(db, payload.person_number)
    except InvalidPersonNumberError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except DuplicateRegistrationError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    except VerificationFailedError as exc:
        raise HTTPException(
            status_code=422, detail="Verification failed: person number not recognized"
        ) from exc
    except VerificationUnavailableError as exc:
        logger.error("STWNO interface unreachable: %s", exc)
        raise HTTPException(
            status_code=503, detail="Verification service is currently unavailable"
        ) from exc

    return user
