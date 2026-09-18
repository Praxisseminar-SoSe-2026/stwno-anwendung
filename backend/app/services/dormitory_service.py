from sqlalchemy.orm import Session

from app.models import Dormitory
from app.schemas.dormitory import DormitoryCreate


def create_dormitory(db: Session, payload: DormitoryCreate) -> Dormitory:
    dorm = Dormitory(**payload.model_dump())
    db.add(dorm)
    db.commit()
    db.refresh(dorm)
    return dorm