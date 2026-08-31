from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING, Literal

from pydantic import BaseModel

if TYPE_CHECKING:
    from app.models.request import Request


class RequestResponse(BaseModel):
    id: int
    type: str
    status: str
    created_at: datetime | None
    resident_id: int

    # repair-specific
    location: str | None = None
    description: str | None = None
    image_url: str | None = None

    # room-specific
    community_room_id: int | None = None
    start_datetime: datetime | None = None
    end_datetime: datetime | None = None
    regular_key_exchange_possible: bool | None = None
    alternative_key_exchange_date: date | None = None

    @classmethod
    def from_request(cls, request: Request) -> RequestResponse:
        from app.models.repair_request import RepairRequest
        from app.models.room_request import RoomRequest

        data = {
            "id": request.id,
            "type": request.type,
            "status": request.status,
            "created_at": request.created_at,
            "resident_id": request.resident_id,
        }

        if isinstance(request, RepairRequest):
            data.update(
                location=request.location,
                description=request.description,
                image_url=request.image_url,
            )
        elif isinstance(request, RoomRequest):
            data.update(
                community_room_id=request.community_room_id,
                start_datetime=request.start_datetime,
                end_datetime=request.end_datetime,
                regular_key_exchange_possible=request.regular_key_exchange_possible,
                alternative_key_exchange_date=request.alternative_key_exchange_date,
            )

        return cls(**data)


class RoomRequestCreate(BaseModel):
    community_room_id: int
    start_date: date
    end_date: date
    regular_key_exchange_possible: bool | None
    alternative_key_exchange_date: date | None


class RoomRequestStatusUpdate(BaseModel):
    # Todo: discuss concept of global standard for status
    status: Literal["Bestätigt", "Abgelehnt"]


class RoomBookings(BaseModel):
    id: int
    community_room_id: int
    dormitory_id: int
    start_datetime: datetime
    end_datetime: datetime
    status: str
