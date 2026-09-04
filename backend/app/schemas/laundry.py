from pydantic import BaseModel, ConfigDict
from datetime import datetime


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
    status: str
    occupied_until: datetime | None = None
