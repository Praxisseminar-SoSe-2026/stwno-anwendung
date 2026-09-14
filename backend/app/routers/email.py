from fastapi import APIRouter, BackgroundTasks

from app.schemas.email import EmailMessage
from app.services.email_service import send_email

router = APIRouter(prefix="/email", tags=["email"])


@router.post("/send", status_code=202)
def send_email_endpoint(message: EmailMessage, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_email, message)
    return {"detail": "Email queued for sending"}
