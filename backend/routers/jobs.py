from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
from routers.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.JobResponse])
def get_jobs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    jobs = db.query(models.Job).filter(models.Job.user_id == current_user.id).all()
    return jobs

@router.post("/", response_model=schemas.JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if job.company_id:
        company = db.query(models.Company).filter(models.Company.id == str(job.company_id), models.Company.user_id == current_user.id).first()
        if not company:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company not found or doesn't belong to the user")
            
    if job.resume_id:
        resume = db.query(models.Resume).filter(models.Resume.id == str(job.resume_id), models.Resume.user_id == current_user.id).first()
        if not resume:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Resume not found or doesn't belong to the user")

    db_job = models.Job(**job.model_dump(), user_id=current_user.id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/{job_id}", response_model=schemas.JobResponse)
def get_job(job_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    job = db.query(models.Job).filter(
        models.Job.id == job_id,
        models.Job.user_id == current_user.id
    ).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job

@router.patch("/{job_id}", response_model=schemas.JobResponse)
def update_job(job_id: str, job_update: schemas.JobUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_job = db.query(models.Job).filter(
        models.Job.id == job_id,
        models.Job.user_id == current_user.id
    ).first()
    if not db_job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    
    update_data = job_update.model_dump(exclude_unset=True)
    if "company_id" in update_data and update_data["company_id"] is not None:
        company = db.query(models.Company).filter(models.Company.id == str(update_data["company_id"]), models.Company.user_id == current_user.id).first()
        if not company:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company not found or doesn't belong to the user")

    if "resume_id" in update_data and update_data["resume_id"] is not None:
        resume = db.query(models.Resume).filter(models.Resume.id == str(update_data["resume_id"]), models.Resume.user_id == current_user.id).first()
        if not resume:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Resume not found or doesn't belong to the user")

    for key, value in update_data.items():
        setattr(db_job, key, value)
        
    db.commit()
    db.refresh(db_job)
    return db_job

@router.patch("/{job_id}/status", response_model=schemas.JobResponse)
def update_job_status(job_id: str, status_update: schemas.JobStatusUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_job = db.query(models.Job).filter(
        models.Job.id == job_id,
        models.Job.user_id == current_user.id
    ).first()
    if not db_job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    
    db_job.status = status_update.status
    db.commit()
    db.refresh(db_job)
    return db_job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_job = db.query(models.Job).filter(
        models.Job.id == job_id,
        models.Job.user_id == current_user.id
    ).first()
    if not db_job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    
    db.delete(db_job)
    db.commit()
    return None
