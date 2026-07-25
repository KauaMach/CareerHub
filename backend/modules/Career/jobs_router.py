from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
from modules.Identity.auth_router import get_current_user
from modules.Career.jobs_service import JobsService

router = APIRouter()

def get_jobs_service(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)) -> JobsService:
    return JobsService(db, current_user)

@router.get("/", response_model=List[schemas.JobResponse])
def get_jobs(service: JobsService = Depends(get_jobs_service)):
    return service.get_jobs()

@router.post("/", response_model=schemas.JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(job: schemas.JobCreate, service: JobsService = Depends(get_jobs_service)):
    return service.create_job(job)

@router.get("/{job_id}", response_model=schemas.JobResponse)
def get_job(job_id: str, service: JobsService = Depends(get_jobs_service)):
    return service.get_job_by_id(job_id)

@router.patch("/{job_id}", response_model=schemas.JobResponse)
def update_job(job_id: str, job_update: schemas.JobUpdate, service: JobsService = Depends(get_jobs_service)):
    return service.update_job(job_id, job_update)

@router.patch("/{job_id}/status", response_model=schemas.JobResponse)
def update_job_status(job_id: str, status_update: schemas.JobStatusUpdate, service: JobsService = Depends(get_jobs_service)):
    return service.update_job_status(job_id, status_update.status)

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: str, service: JobsService = Depends(get_jobs_service)):
    service.delete_job(job_id)
    return None
