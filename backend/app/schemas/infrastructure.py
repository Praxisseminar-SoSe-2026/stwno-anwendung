from pydantic import BaseModel


# Todo: this could be the file for more infrastructure related schemas,
#  e.g. rentable cleaning gadgets
class CommunityRoomResponse(BaseModel):
    id: int
    name: str
    description: str | None
    dormitory_id: int
    
    
class CommunityRoomCreate(BaseModel):
    name: str
    description: str | None
    dormitory_id: int


class CommunityRoomUpdate(BaseModel):
    name: str
    description: str | None


class LaundryRoomResponse(BaseModel):
    id: int
    name: str
    dormitory_id: int


class LaundryRoomCreate(BaseModel):
    name: str
    dormitory_id: int


class LaundryRoomUpdate(BaseModel):
    name: str
