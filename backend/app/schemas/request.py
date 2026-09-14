from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING

from pydantic import BaseModel

from app.core.status import RequestStatus

if TYPE_CHECKING:
    from app.models.request import Request


class ResidentInfo(BaseModel):
    id: int
    first_name: str
    last_name: str
    flat_number: str | None = None


# only start time because end time is auto generated
class AccessTimeSlotProposalCreate(BaseModel):
    start_time: datetime


class AccessTimeSlotProposalResponse(BaseModel):
    id: int
    start_time: datetime
    end_time: datetime


class AccessTimeSlotSelect(BaseModel):
    time_slot_proposal_id: int


class AccessTimeSlotResponse(BaseModel):
    id: int
    start_time: datetime
    end_time: datetime


class CommentCreate(BaseModel):
    text: str


class CommentResponse(BaseModel):
    id: int
    author: ResidentInfo
    text: str
    created_at: datetime | None


class StatusHistoryResponse(BaseModel):
    id: int
    status: str
    changed_by: ResidentInfo
    changed_at: datetime | None



class RequestResponse(BaseModel):
    id: int
    type: str
    status: RequestStatus
    created_at: datetime | None
    resident: ResidentInfo
    can_edit: bool = False

    # repair-specific
    location: str | None = None
    description: str | None = None
    image_url: str | None = None
    entry_permission: bool | None = None
    proposed_date_note: str | None = None
    proposed_time_slots: list[AccessTimeSlotProposalResponse] = []
    access_time_slot: AccessTimeSlotResponse | None = None
    comments: list[CommentResponse] = []
    status_history: list[StatusHistoryResponse] = []

    # room-specific
    community_room_id: int | None = None
    start_datetime: datetime | None = None
    end_datetime: datetime | None = None
    regular_key_exchange_possible: bool | None = None
    alternative_key_exchange_date: date | None = None

    @classmethod
    def from_request(
        cls, request: Request, *, can_edit: bool = False
    ) -> RequestResponse:
        from app.models.repair_request import RepairRequest
        from app.models.room_request import RoomRequest

        def _resident_info(user) -> ResidentInfo:
            return ResidentInfo(
                id=user.id,
                first_name=user.first_name,
                last_name=user.last_name,
                flat_number=user.flat_number,
            )

        data = {
            "id": request.id,
            "type": request.type,
            "status": request.status,
            "created_at": request.created_at,
            "resident": _resident_info(request.resident),
            "can_edit": can_edit,
            "comments": [
                CommentResponse(
                    id=comment.id,
                    author=_resident_info(comment.author),
                    text=comment.text,
                    created_at=comment.created_at,
                )
                for comment in request.comments
            ],
        }

        if isinstance(request, RepairRequest):
            data.update(
                location=request.location,
                description=request.description,
                image_url=request.image_url,
                entry_permission=request.entry_permission,
                proposed_date_note=request.proposed_date_note,
                proposed_time_slots=[
                    AccessTimeSlotProposalResponse(
                        id=slot.id,
                        start_time=slot.start_time,
                        end_time=slot.end_time,
                    )
                    for slot in request.time_slot_proposals
                ],
                access_time_slot=(
                    AccessTimeSlotResponse(
                        id=request.access_time_slot.id,
                        start_time=request.access_time_slot.start_time,
                        end_time=request.access_time_slot.end_time,
                    )
                    if request.access_time_slot
                    else None
                ),
                status_history=[
                    StatusHistoryResponse(
                        id=entry.id,
                        status=entry.status,
                        changed_by=_resident_info(entry.changed_by),
                        changed_at=entry.changed_at,
                    )
                    for entry in request.status_history
                ],
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


class RepairRequestCreate(BaseModel):
    description: str
    location: str
    image_url: str | None = None
    entry_permission: bool = False
    proposed_time_slots: list[AccessTimeSlotProposalCreate] = []
    proposed_date_note: str | None = None


class RoomRequestCreate(BaseModel):
    community_room_id: int
    start_date: date
    end_date: date
    regular_key_exchange_possible: bool | None
    alternative_key_exchange_date: date | None



class RequestStatusUpdate(BaseModel):
    status: RequestStatus


class RoomBookings(BaseModel):
    id: int
    community_room_id: int
    dormitory_id: int
    start_datetime: datetime
    end_datetime: datetime
    status: RequestStatus
