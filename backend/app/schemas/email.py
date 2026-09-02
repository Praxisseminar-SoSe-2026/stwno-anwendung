from pydantic import BaseModel, EmailStr


class EmailMessage(BaseModel):
    receiver: EmailStr
    subject: str
    text: str
