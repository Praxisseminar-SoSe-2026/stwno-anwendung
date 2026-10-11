import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.dependencies import require_permission
from app.db.database import get_db
from app.models.user import User
from app.schemas.resident_import import ImportReportResponse, RowIssueResponse
from app.services.resident_import_parser import ImportFileError
from app.services.resident_import_service import (
    ImportConflictError,
    import_resident_file,
)

logger = logging.getLogger("app.resident_import")

router = APIRouter(prefix="/import", tags=["import"])


@router.post("/resident-master-data", response_model=ImportReportResponse)
def import_resident_master_data_file(
    file: UploadFile,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_permission("manage_users"))],
):
    # threadpool so reading the file does not block
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    content = file.file.read(max_bytes + 1)
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File must be smaller than {settings.max_upload_size_mb} MB",
        )

    try:
        report = import_resident_file(db, file.filename, content)
    except ImportFileError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except ImportConflictError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc

    logger.info(
        "User %s ran resident import: %s errors, %s warnings",
        current_user.id,
        len(report.errors),
        len(report.warnings),
    )

    return ImportReportResponse(
        success=not report.errors,
        created=report.created,
        updated=report.updated,
        unchanged=report.unchanged,
        errors=[RowIssueResponse(row_number=i.row_number, message=i.message) for i in report.errors],
        warnings=[RowIssueResponse(row_number=i.row_number, message=i.message) for i in report.warnings],
    )