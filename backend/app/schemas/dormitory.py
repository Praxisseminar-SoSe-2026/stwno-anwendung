from pydantic import BaseModel, ConfigDict


class DormitoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    address: str
    city: str
    zip_code: str