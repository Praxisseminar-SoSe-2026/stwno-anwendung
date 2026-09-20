from sqlalchemy.orm import Session

from app.models import User
from app.schemas.user import UserUpdate


class UserNotFoundError(Exception):
    pass

def update_user(db: Session, user_id: int, payload: UserUpdate) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise UserNotFoundError(f"No user found with id {user_id}")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    if update_data:
        db.commit()
        db.refresh(user)
    return user