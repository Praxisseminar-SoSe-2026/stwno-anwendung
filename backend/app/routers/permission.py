from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.permission import PermissionRead
from app.services import permission_service

router = APIRouter(prefix="/permissions", tags=["permissions"])


@router.get("/", response_model=list[PermissionRead])
def read_permissions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return permission_service.get_permissions(db, skip=skip, limit=limit)


@router.get("/{permission_id}", response_model=PermissionRead)
def read_permission(permission_id: int, db: Session = Depends(get_db)):
    db_permission = permission_service.get_permission(db, permission_id)
    if db_permission is None:
        raise HTTPException(status_code=404, detail="Permission not found")
    return db_permission
