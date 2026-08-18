from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.request import RequestResponse
from app.services.request_service import (
    RequestAccessDeniedError,
    RequestNotFoundError,
    get_request,
    list_requests,
)

router = APIRouter(prefix="/requests", tags=["requests"])


@router.get("", response_model=list[RequestResponse])
def list_all(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    requests = list_requests(db, current_user)
    return [RequestResponse.from_request(r) for r in requests]


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