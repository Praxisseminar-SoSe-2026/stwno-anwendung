from pydantic import BaseModel, ConfigDict


# Todo: this could be the file for more infrastructure related schemas, e.g. rentable cleaning gadgets
class CommunityRoomResponse(BaseModel):
    id: int
    name: str
    description: str | None
    dormitory_id: int
