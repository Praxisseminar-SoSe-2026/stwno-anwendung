from pydantic import BaseModel


class RowIssueResponse(BaseModel):
    row_number: int
    message: str


class ImportReportResponse(BaseModel):
    success: bool
    created: int
    updated: int
    unchanged: int
    errors: list[RowIssueResponse]
    warnings: list[RowIssueResponse]