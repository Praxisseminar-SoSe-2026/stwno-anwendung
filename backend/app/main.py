from fastapi import FastAPI

from app.core.config import settings
from app.routers import permission

app = FastAPI(title=settings.app_name)

app.include_router(permission.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}