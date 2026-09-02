import logging

from fastapi import Depends, HTTPException, Request, Response
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.permission import user_has_permission
from app.core.security import (
    InvalidTokenError,
    create_access_token,
    decode_access_token,
)
from app.db.database import get_db
from app.models.user import User

logger = logging.getLogger("app.auth")

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    request: Request,
    response: Response,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        logger.warning(
            "Unauthorized access attempt to %s from %s (no token)",
            request.url.path,
            request.client.host if request.client else "unknown",
        )
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        user_id = decode_access_token(credentials.credentials)
    except InvalidTokenError as exc:
        logger.warning(
            "Unauthorized access attempt to %s from %s (%s)",
            request.url.path,
            request.client.host if request.client else "unknown",
            str(exc),
        )
        raise HTTPException(status_code=401, detail=str(exc)) from exc

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        logger.warning(
            "Unauthorized access attempt to %s (user %s no longer exists)",
            request.url.path,
            user_id,
        )
        raise HTTPException(status_code=401, detail="Not authenticated")

    new_token = create_access_token(user.id)
    response.headers["X-Access-Token"] = new_token

    return user


def require_permission(permission_name: str):
    def checker(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> User:
        if not user_has_permission(db, current_user.id, permission_name):
            logger.warning(
                "User %s lacks permission '%s'", current_user.id, permission_name
            )
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user

    return checker
