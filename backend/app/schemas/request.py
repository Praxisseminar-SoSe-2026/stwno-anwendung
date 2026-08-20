from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

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
            )

        return cls(**data)


class RoomRequestCreate(BaseModel):
    community_room_id: int
    start_datetime: datetime
    end_datetime: datetime
