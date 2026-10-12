from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    access_token: str
    token_type: str = "bearer"
    dormitory_id: int | None = None
    flat_number: str | None = None
    roles: list[str] = []
