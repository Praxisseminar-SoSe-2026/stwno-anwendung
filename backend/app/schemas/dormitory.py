from pydantic import BaseModel, ConfigDict


class DormitoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    address: str
    city: str
    zip_code: str


class DormitoryCreate(BaseModel):
    name: str
    address: str
    city: str
    zip_code: str


class DormitoryUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    city: str | None = None
    zip_code: str | None = None
