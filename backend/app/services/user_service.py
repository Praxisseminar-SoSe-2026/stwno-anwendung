from sqlalchemy.orm import Session

from app.core.permission import get_user_role
from app.models import Role, User, UserRole
from app.schemas.user import UserUpdate


class UserNotFoundError(Exception):
    pass

class RoleNotFoundError(Exception):
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

    update_data = payload.model_dump(exclude_unset=True, exclude={"roles"})
    for field, value in update_data.items():
        setattr(user, field, value)

    # The role(s) update was created with the help of Claude
    if payload.roles is not None:
        roles = db.query(Role).filter(Role.name.in_(payload.roles)).all()
        found_names = {role.name for role in roles}
        missing = set(payload.roles) - found_names
        if missing:
            raise RoleNotFoundError(f"Unknown role(s): {', '.join(missing)}")

        db.query(UserRole).filter(UserRole.user_id == user_id).delete(
            synchronize_session=False
        )
        for role in roles:
            db.add(UserRole(user_id=user_id, role_id=role.id))

    db.commit()
    db.refresh(user)
    return user