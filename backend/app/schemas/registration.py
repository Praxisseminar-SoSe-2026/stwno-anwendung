from pydantic import BaseModel, field_validator


class RegistrationRequest(BaseModel):
    person_number: str

    @field_validator("person_number")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()