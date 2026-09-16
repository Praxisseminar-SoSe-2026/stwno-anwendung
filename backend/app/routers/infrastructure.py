import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.infrastructure import (
    CommunityRoomResponse,
    LaundryRoomCreate,
    LaundryRoomResponse,
    LaundryRoomUpdate,
    CommunityRoomCreate,
)
from app.schemas.laundry import (
    LaundryMachineResponse,
    LaundryRoomCreateMachine,
    LaundryRoomUpdateMachine,
)
from app.services.infrastructure_service import (
    LaundryMachineNotFoundError,
    LaundryRoomNotFoundError,
    create_laundry_machine,
    create_laundry_room,
    delete_laundry_machine,
    delete_laundry_room,
    get_laundry_machine,
    list_community_rooms,
    list_laundry_machines_in_laundry_room,
    list_laundry_rooms,
    update_laundry_machine,
    update_laundry_room,
    create_community_room,
    update_community_room,
)
from app.services.laundry_booking_service import MachineNotFoundError
from app.services.request_service import ResidentDormitoryError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/infrastructure", tags=["infrastructure"])


@router.get("/community_rooms", response_model=list[CommunityRoomResponse])
def list_all_rooms(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        return list_community_rooms(db, current_user)
    except ResidentDormitoryError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    
    
@router.post("/community_rooms", response_model=CommunityRoomResponse)
def create_room_community(
    payload: CommunityRoomCreate,
    db: Annotated[Session, Depends(get_db)],
):
    return create_community_room(db, payload)


@router.put("/community_rooms/{room_id}", response_model=LaundryRoomResponse)
def update_room_laundry(
    room_id: int,
    payload: LaundryRoomUpdate,
    db: Annotated[Session, Depends(get_db)],
):
    try:
        return update_community_room(db, room_id, payload)
    except LaundryRoomNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/laundry_rooms", response_model=list[LaundryRoomResponse])
def list_all_laundry_rooms(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        return list_laundry_rooms(db, current_user)
    except ResidentDormitoryError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/laundry_rooms", response_model=LaundryRoomResponse)
def create_room_laundry(
    payload: LaundryRoomCreate,
    db: Annotated[Session, Depends(get_db)],
):
    return create_laundry_room(db, payload)


@router.put("/laundry_rooms/{room_id}", response_model=LaundryRoomResponse)
def update_room_laundry(
    room_id: int,
    payload: LaundryRoomUpdate,
    db: Annotated[Session, Depends(get_db)],
):
    try:
        return update_laundry_room(db, room_id, payload)
    except LaundryRoomNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.delete("/laundry_rooms/{room_id}")
def delete_room_laundry(
    room_id: int,
    db: Annotated[Session, Depends(get_db)],
):
    try:
        delete_laundry_room(db, room_id)
    except LaundryRoomNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc



@router.get("/laundry_rooms/{laundry_room_id}/laundry_machines",
            response_model=list[LaundryMachineResponse])
def list_all_laundry_machines(
    laundry_room_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        return list_laundry_machines_in_laundry_room(db, current_user, laundry_room_id)
    except LaundryRoomNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ResidentDormitoryError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/laundry_machines/{laundry_machine_id}",
            response_model=LaundryMachineResponse)
def get_one_laundry_machine(
    laundry_machine_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        return get_laundry_machine(db, current_user, laundry_machine_id)
    except MachineNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ResidentDormitoryError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    
    
@router.post("/laundry_machines", response_model=LaundryMachineResponse)
def create_machine(
        payload: LaundryRoomCreateMachine,
        db: Annotated[Session, Depends(get_db)]
):
    return create_laundry_machine(db, payload)

@router.delete("/laundry_machines/{machine_id}")
def delete_machine(
        machine_id: int,
        db: Annotated[Session, Depends(get_db)],
):
    try:
        delete_laundry_machine(db, machine_id)
    except LaundryMachineNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    
    
@router.put("/laundry_machines/{machine_id}", response_model=LaundryMachineResponse)
def update_machine(
        machine_id: int,
        payload: LaundryRoomUpdateMachine,
        db: Annotated[Session, Depends(get_db)],
): 
    try:
        return update_laundry_machine(db, machine_id, payload)
    except LaundryMachineNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
