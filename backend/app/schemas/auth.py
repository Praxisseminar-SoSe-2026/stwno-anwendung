from pydantic import BaseModel, EmailStr


class SetPasswordRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str