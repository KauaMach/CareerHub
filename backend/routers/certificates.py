from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
from routers.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.CertificateResponse])
def get_certificates(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    certificates = db.query(models.Certificate).filter(models.Certificate.user_id == current_user.id).all()
    return certificates

@router.post("/", response_model=schemas.CertificateResponse, status_code=status.HTTP_201_CREATED)
def create_certificate(certificate: schemas.CertificateCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_certificate = models.Certificate(**certificate.model_dump(), user_id=current_user.id)
    db.add(db_certificate)
    db.commit()
    db.refresh(db_certificate)
    return db_certificate

@router.get("/{certificate_id}", response_model=schemas.CertificateResponse)
def get_certificate(certificate_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    certificate = db.query(models.Certificate).filter(
        models.Certificate.id == certificate_id,
        models.Certificate.user_id == current_user.id
    ).first()
    if not certificate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found")
    return certificate

@router.patch("/{certificate_id}", response_model=schemas.CertificateResponse)
def update_certificate(certificate_id: str, certificate_update: schemas.CertificateUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_certificate = db.query(models.Certificate).filter(
        models.Certificate.id == certificate_id,
        models.Certificate.user_id == current_user.id
    ).first()
    if not db_certificate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found")
    
    update_data = certificate_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_certificate, key, value)
        
    db.commit()
    db.refresh(db_certificate)
    return db_certificate

@router.delete("/{certificate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certificate(certificate_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_certificate = db.query(models.Certificate).filter(
        models.Certificate.id == certificate_id,
        models.Certificate.user_id == current_user.id
    ).first()
    if not db_certificate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found")
    
    db.delete(db_certificate)
    db.commit()
    return None
