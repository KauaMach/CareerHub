from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
import models
import schemas

class JobsService:
    def __init__(self, db: Session, user: models.User):
        self.db = db
        self.user = user

    def get_jobs(self) -> List[models.Job]:
        return self.db.query(models.Job).filter(models.Job.user_id == self.user.id).all()

    def get_job_by_id(self, job_id: str) -> models.Job:
        job = self.db.query(models.Job).filter(
            models.Job.id == job_id,
            models.Job.user_id == self.user.id
        ).first()
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
        return job

    def create_job(self, job_create: schemas.JobCreate) -> models.Job:
        self._validate_foreign_keys(job_create.company_id, job_create.resume_id)
        
        db_job = models.Job(**job_create.model_dump(), user_id=self.user.id)
        self.db.add(db_job)
        self.db.commit()
        self.db.refresh(db_job)
        return db_job

    def update_job(self, job_id: str, job_update: schemas.JobUpdate) -> models.Job:
        db_job = self.get_job_by_id(job_id)
        update_data = job_update.model_dump(exclude_unset=True)
        
        self._validate_foreign_keys(update_data.get("company_id"), update_data.get("resume_id"))

        for key, value in update_data.items():
            setattr(db_job, key, value)
            
        self.db.commit()
        self.db.refresh(db_job)
        return db_job

    def update_job_status(self, job_id: str, new_status: str) -> models.Job:
        db_job = self.get_job_by_id(job_id)
        db_job.status = new_status
        
        # Here we will emit Domain Events in the future! (e.g., JobStatusChanged)
        
        self.db.commit()
        self.db.refresh(db_job)
        return db_job

    def delete_job(self, job_id: str) -> None:
        db_job = self.get_job_by_id(job_id)
        self.db.delete(db_job)
        self.db.commit()

    def _validate_foreign_keys(self, company_id: Optional[str] = None, resume_id: Optional[str] = None):
        if company_id:
            company = self.db.query(models.Company).filter(
                models.Company.id == str(company_id), 
                models.Company.user_id == self.user.id
            ).first()
            if not company:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company not found or doesn't belong to the user")
                
        if resume_id:
            resume = self.db.query(models.Resume).filter(
                models.Resume.id == str(resume_id), 
                models.Resume.user_id == self.user.id
            ).first()
            if not resume:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Resume not found or doesn't belong to the user")
