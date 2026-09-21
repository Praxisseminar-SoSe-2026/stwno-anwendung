from sqlalchemy.orm import Session

from app.models import (
    Announcement,
    CommunityRoom,
    Dormitory,
    DormitoryFacilityManager,
    ItemType,
    LaundryBooking,
    LaundryMachine,
    LaundryRoom,
    RepairRequest,
    RoomRequest,
    User,
)
from app.schemas.dormitory import DormitoryCreate, DormitoryUpdate


class DormitoryNotFoundError(Exception):
    pass


def list_all_dormitories(db: Session) -> list[Dormitory]:
    return db.query(Dormitory).order_by(Dormitory.name).all()

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


def delete_dormitory(db: Session, dorm_id: int):
    dorm = db.query(Dormitory).filter(Dormitory.id == dorm_id).first()
    if dorm is None:
        raise DormitoryNotFoundError(f"No dormitory found with id {dorm_id}")

    # Dormitory is null for current residents
    db.query(User).filter(User.dormitory_id == dorm_id).update(
        {"dormitory_id": None}, synchronize_session=False
    )

    # Delete this dorm for facility manager (can have more than 1)
    db.query(DormitoryFacilityManager).filter(
        DormitoryFacilityManager.dormitory_id == dorm_id
    ).delete(synchronize_session=False)

    # deletes bookings, machines and rooms for laundry
    laundry_room_ids = [
        room_id
        for (room_id,) in db.query(LaundryRoom.id)
        .filter(LaundryRoom.dormitory_id == dorm_id)
        .all()
    ]
    if laundry_room_ids:
        machine_ids = [
            machine_id
            for (machine_id,) in db.query(LaundryMachine.id)
            .filter(LaundryMachine.laundry_room_id.in_(laundry_room_ids))
            .all()
        ]
        if machine_ids:
            db.query(LaundryBooking).filter(
                LaundryBooking.laundry_machine_id.in_(machine_ids)
            ).delete(synchronize_session=False)

            db.query(LaundryMachine).filter(LaundryMachine.id.in_(machine_ids)).delete(
                synchronize_session=False
            )

        db.query(LaundryRoom).filter(LaundryRoom.id.in_(laundry_room_ids)).delete(
            synchronize_session=False
        )

    # deletes bookings/request and community rooms
    community_room_ids = [
        room_id
        for (room_id,) in db.query(CommunityRoom.id)
        .filter(CommunityRoom.dormitory_id == dorm_id)
        .all()
    ]
    if community_room_ids:
        db.query(RoomRequest).filter(
            RoomRequest.community_room_id.in_(community_room_ids)
        ).delete(synchronize_session=False)

        db.query(CommunityRoom).filter(CommunityRoom.id.in_(community_room_ids)).delete(
            synchronize_session=False
        )

    # deletes announcement for this dorm
    db.query(Announcement).filter(Announcement.dormitory_id == dorm_id).delete(
        synchronize_session=False
    )

    # deletes items (for future work relevant and needed to use endpoint)
    db.query(ItemType).filter(ItemType.dormitory_id == dorm_id).delete(
        synchronize_session=False
    )

    # repair requests deletion
    db.query(RepairRequest).filter(
        RepairRequest.assigned_dormitory_id == dorm_id
    ).delete(synchronize_session=False)

    db.delete(dorm)
    db.commit()