from pydantic import BaseModel, ConfigDict


# Todo: discuss and if necessary add created_by and updated_at
class FaqCategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class FaqEntryCreateRequest(BaseModel):
    question: str
    answer: str
    category_id: int


class FaqEntryUpdateRequest(BaseModel):
    question: str | None = None
    answer: str | None = None
    category_id: int | None = None


class FaqEntryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    question: str
    answer: str
    category: FaqCategoryResponse | None
