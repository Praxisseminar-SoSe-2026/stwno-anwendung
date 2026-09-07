from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.middleware import RequestLoggingMiddleware
from app.db.database import get_db
from app.routers import (
    announcement,
    auth,
    dormitory,
    email,
    faq,
    infrastructure,
    permission,
    registration,
    request,
    upload,
)

setup_logging(level=settings.log_level, environment=settings.environment)

app = FastAPI(title=settings.app_name)

# allow frontend access to APIs
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.add_middleware(RequestLoggingMiddleware)

Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=settings.upload_dir), name="media")

app.include_router(permission.router)
app.include_router(request.router)
app.include_router(registration.router)
app.include_router(announcement.router)
app.include_router(email.router)
app.include_router(dormitory.router)
app.include_router(auth.router)
app.include_router(faq.router)
app.include_router(infrastructure.router)
app.include_router(upload.router)


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
    except OperationalError as exc:
        raise HTTPException(status_code=503, detail="Database unavailable") from exc
    return {"status": "ok"}
