from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
import models
import schemas

class ResumesService:
    def __init__(self, db: Session, user: models.User):
        self.db = db
        self.user = user

    def get_resumes(self) -> List[models.Resume]:
        return self.db.query(models.Resume).filter(models.Resume.user_id == self.user.id).all()

    def get_resume_by_id(self, resume_id: str) -> models.Resume:
        resume = self.db.query(models.Resume).filter(
            models.Resume.id == resume_id,
            models.Resume.user_id == self.user.id
        ).first()
        if not resume:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
        return resume

    def create_resume(self, resume_create: schemas.ResumeCreate) -> models.Resume:
        db_resume = models.Resume(**resume_create.model_dump(), user_id=self.user.id)
        self.db.add(db_resume)
        self.db.commit()
        self.db.refresh(db_resume)
        return db_resume

    def update_resume(self, resume_id: str, resume_update: schemas.ResumeUpdate) -> models.Resume:
        db_resume = self.get_resume_by_id(resume_id)
        update_data = resume_update.model_dump(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(db_resume, key, value)
            
        self.db.commit()
        self.db.refresh(db_resume)
        return db_resume

    def delete_resume(self, resume_id: str) -> None:
        db_resume = self.get_resume_by_id(resume_id)
        self.db.delete(db_resume)
        self.db.commit()
