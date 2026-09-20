from sqlalchemy.orm import Session

from app.core.permission import get_user_role
from app.models import User
from app.schemas.user import UserUpdate


class UserNotFoundError(Exception):
    pass


def list_users(db: Session) -> list[dict]:
    users = db.query(User).order_by(User.last_name).all()
    result = []
    for user in users:
        roles = get_user_role(db, user.id)
        result.append(
            {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "person_number": user.person_number,
                "flat_number": user.flat_number,
                "contract_end": user.contract_end,
                "dormitory_id": user.dormitory_id,
                "created_at": user.created_at,
                "roles": roles,
            }
        )
    return result

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