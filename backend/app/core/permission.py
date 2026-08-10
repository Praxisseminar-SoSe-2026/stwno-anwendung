from sqlalchemy.orm import Session

from app.models.permission import Permission
from app.models.role_permission import RolePermission
from app.models.user_role import UserRole


def user_has_permission(db: Session, user_id: int, permission_name: str) -> bool:
    exists = (
        db.query(Permission)
        .join(RolePermission, RolePermission.permission_id == Permission.id)
        .join(UserRole, UserRole.role_id == RolePermission.role_id)
        .filter(UserRole.user_id == user_id, Permission.name == permission_name)
        .first()
    )
    return exists is not None