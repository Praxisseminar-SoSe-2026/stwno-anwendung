from sqlalchemy.orm import Session

from app.models import Dormitory
from app.schemas.dormitory import DormitoryCreate, DormitoryUpdate


class DormitoryNotFoundError(Exception):
    pass


def create_dormitory(db: Session, payload: DormitoryCreate) -> Dormitory:
    dorm = Dormitory(**payload.model_dump())
    db.add(dorm)
    db.commit()
    db.refresh(dorm)
    return dorm


def update_dormitory(db: Session, dorm_id: int, payload: DormitoryUpdate):
    dorm = db.query(Dormitory).filter(Dormitory.id == dorm_id).first()
    if dorm is None:
        raise DormitoryNotFoundError(f"No dormitory found with id {dorm_id}")
    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(dorm, field, value)

    if update_data:
        db.commit()
        db.refresh(dorm)
    return dorm