from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    last_name: str
    email: str
    person_number: str
    flat_number: str | None
    contract_end: date | None
    dormitory_id: int | None
    created_at: datetime | None
    roles: list[str] = []


class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    flat_number: str | None = None
    contract_end: date | None = None
    dormitory_id: int | None = None
