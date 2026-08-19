import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.faq import (
    FaqCategoryResponse,
    FaqEntryCreateRequest,
    FaqEntryResponse,
    FaqEntryUpdateRequest,
)
from app.services.faq_service import (
    FaqCategoryNotFoundError,
    FaqEntryNotFoundError,
    create_faq_entry,
    delete_faq_entry,
    list_categories,
    list_faq_entries,
    update_faq_entry,
    get_faq_entry
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/faq", tags=["faq"])


@router.get("/categories", response_model=list[FaqCategoryResponse])
def list_faq_categories(
    db: Annotated[Session, Depends(get_db)],
):
    return list_categories(db)


@router.get("/{faq_id}", response_model=FaqEntryResponse)
def get_one(
        faq_id: int,
        db: Annotated[Session, Depends(get_db)],
):
    try:
        return get_faq_entry(db, faq_id)
    except FaqEntryNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("", response_model=list[FaqEntryResponse])
def list_faq_questions(db: Annotated[Session, Depends(get_db)]):
    return list_faq_entries(db)


@router.post("", response_model=FaqEntryResponse)
def create(
    payload: FaqEntryCreateRequest,
    db: Annotated[Session, Depends(get_db)],
):
    try:
        # Todo: enable current user logging
        return create_faq_entry(db, payload)
    except FaqCategoryNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/{faq_id}", response_model=FaqEntryResponse)
def update(
    faq_id: int,
    payload: FaqEntryUpdateRequest,
    db: Annotated[Session, Depends(get_db)],
):
    try:
        return update_faq_entry(db, faq_id, payload)
    except FaqEntryNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except FaqCategoryNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.delete("/{faq_id}")
def delete(
    faq_id: int,
    db: Annotated[Session, Depends(get_db)],
):
    try:
        delete_faq_entry(db, faq_id)
    except FaqEntryNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
