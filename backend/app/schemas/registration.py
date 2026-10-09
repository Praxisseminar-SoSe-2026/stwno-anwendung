from pydantic import BaseModel, EmailStr, Field, field_validator


class RegistrationRequest(BaseModel):
    person_number: str
    email: EmailStr
    language: str = "de"

    @field_validator("person_number")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()


class RegistrationStartedResponse(BaseModel):
    message: str


class CompleteRegistrationRequest(BaseModel):
    token: str
    password: str = Field(min_length=6)
    consent: bool
    policy_version: str

    @field_validator("consent")
    @classmethod
    def consent_must_be_given(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Consent to data processing is required")
        return v
