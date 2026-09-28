from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class AnnouncementCreate(BaseModel):
    title: str
    text: str
    image_url: str | None = None
    important: bool = False
    dormitory_id: int | None = None


class AnnouncementUpdate(BaseModel):
    title: str | None = None
    text: str | None = None
    image_url: str | None = None
    important: bool | None = None
    dormitory_id: int | None = None

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str | None) -> str | None:
        if v is not None and not v.strip():
            raise ValueError("Title cannot be empty")
        return v


# The announcement will contain this
class AnnouncementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    text: str
    image_url: str | None
    important: bool | None
    author_id: int
    dormitory_id: int | None
    created_at: datetime | None
