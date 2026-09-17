from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.core.status import LaundryStatus, LaundryType


class LaundryBookingCreate(BaseModel):
    laundry_machine_id: int
    duration: int


class LaundryBookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    laundry_machine_id: int
    resident_id: int
    started_at: datetime
    ends_at: datetime
    cancelled_at: datetime | None


class LaundryMachineResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    laundry_room_id: int
    label: str
    type: str
    status: LaundryStatus
    occupied_until: datetime | None = None
    current_booking_id: int | None = None
    is_own_booking: bool = False
    
    
class LaundryRoomCreateMachine(BaseModel):
    laundry_room_id: int
    type: LaundryType
    status: LaundryStatus
    label: str | None = None


class LaundryRoomUpdateMachine(BaseModel):
    id: int | None = None
    laundry_room_id: int | None = None
    type: LaundryType | None = None
    status: LaundryStatus | None = None
    
