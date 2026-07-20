from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.permission import Permission
from app.schemas.permission import PermissionCreate


def create_permission(db: Session, permission: PermissionCreate) -> Permission:
    db_permission = Permission(**permission.model_dump())
    db.add(db_permission)
    db.commit()
    db.refresh(db_permission)
    return db_permission


def get_permissions(db: Session, skip: int = 0, limit: int = 100) -> list[Permission]:
    stmt = select(Permission).offset(skip).limit(limit)
    return list(db.execute(stmt).scalars().all())


def get_permission(db: Session, permission_id: int) -> Permission | None:
    stmt = select(Permission).where(Permission.id == permission_id)
    return db.execute(stmt).scalars().first()
