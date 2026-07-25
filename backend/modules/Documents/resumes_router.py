from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
from modules.Identity.auth_router import get_current_user
from modules.Documents.resumes_service import ResumesService

router = APIRouter()

def get_resumes_service(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)) -> ResumesService:
    return ResumesService(db, current_user)

@router.get("/", response_model=List[schemas.ResumeResponse])
def get_resumes(service: ResumesService = Depends(get_resumes_service)):
    return service.get_resumes()

@router.post("/", response_model=schemas.ResumeResponse, status_code=status.HTTP_201_CREATED)
def create_resume(resume: schemas.ResumeCreate, service: ResumesService = Depends(get_resumes_service)):
    return service.create_resume(resume)

@router.get("/{resume_id}", response_model=schemas.ResumeResponse)
def get_resume(resume_id: str, service: ResumesService = Depends(get_resumes_service)):
    return service.get_resume_by_id(resume_id)

@router.patch("/{resume_id}", response_model=schemas.ResumeResponse)
def update_resume(resume_id: str, resume_update: schemas.ResumeUpdate, service: ResumesService = Depends(get_resumes_service)):
    return service.update_resume(resume_id, resume_update)

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(resume_id: str, service: ResumesService = Depends(get_resumes_service)):
    service.delete_resume(resume_id)
    return None
