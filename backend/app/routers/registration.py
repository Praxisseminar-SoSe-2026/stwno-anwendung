import logging

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import create_registration_token
from app.db.database import get_db
from app.schemas.registration import (
    CompleteRegistrationRequest,
    RegistrationRequest,
    RegistrationStartedResponse,
)
from app.schemas.user import UserResponse
from app.services.email_service import send_emails
from app.services.notification_service import registration_email
from app.services.registration_service import (
    DuplicateRegistrationError,
    InvalidRegistrationTokenError,
    PolicyVersionMismatchError,
    VerificationFailedError,
    complete_registration,
    start_registration,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/registration", tags=["registration"])


@router.post("", response_model=RegistrationStartedResponse, status_code=202)
def start(
    payload: RegistrationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    try:
        master_data = start_registration(db, payload.person_number, payload.email)
    except VerificationFailedError as exc:
        raise HTTPException(
            status_code=422,
            detail="Verification failed: person number and email do not match",
        ) from exc
    except DuplicateRegistrationError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc

    token = create_registration_token(master_data.id)
    background_tasks.add_task(
        send_emails, registration_email(master_data, token, payload.language)
    )
    return RegistrationStartedResponse(message="Confirmation email sent")


@router.post("/complete", response_model=UserResponse, status_code=201)
def complete(payload: CompleteRegistrationRequest, db: Session = Depends(get_db)):
    try:
        user = complete_registration(
            db, payload.token, payload.password, payload.policy_version
        )
    except InvalidRegistrationTokenError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except DuplicateRegistrationError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    except PolicyVersionMismatchError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc

    return user
