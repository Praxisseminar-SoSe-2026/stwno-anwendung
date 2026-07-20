from pydantic import BaseModel, ConfigDict


class PermissionBase(BaseModel):
    name: str
    description: str | None = None


class PermissionCreate(PermissionBase):
    pass


class PermissionRead(PermissionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
