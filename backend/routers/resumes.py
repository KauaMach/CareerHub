from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
from routers.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.ResumeResponse])
def get_resumes(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).all()
    return resumes

@router.post("/", response_model=schemas.ResumeResponse, status_code=status.HTTP_201_CREATED)
def create_resume(resume: schemas.ResumeCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_resume = models.Resume(**resume.model_dump(), user_id=current_user.id)
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume

@router.get("/{resume_id}", response_model=schemas.ResumeResponse)
def get_resume(resume_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume

@router.patch("/{resume_id}", response_model=schemas.ResumeResponse)
def update_resume(resume_id: str, resume_update: schemas.ResumeUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    if not db_resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    
    update_data = resume_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_resume, key, value)
        
    db.commit()
    db.refresh(db_resume)
    return db_resume

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(resume_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    if not db_resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    
    db.delete(db_resume)
    db.commit()
    return None
