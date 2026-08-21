from sqlalchemy.orm import Session

from app.models.community_room import CommunityRoom
from app.models.user import User
from app.services.request_service import ResidentDormitoryError


# Todo: this could be the file for more infrastructure related querys, e.g. rentable cleaning gadgets
def list_community_rooms(db: Session, current_user: User) -> list[CommunityRoom]:
    if current_user.dormitory_id is None:
        raise ResidentDormitoryError(
            "User has no dormitory assigned; cannot list community rooms"
        )
    community_rooms = (db.query(CommunityRoom)
                       .filter(CommunityRoom.dormitory_id == current_user.dormitory_id)
                       .all()
                       )

    return community_rooms
