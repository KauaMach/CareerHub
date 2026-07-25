from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
import models
import schemas

class CertificatesService:
    def __init__(self, db: Session, user: models.User):
        self.db = db
        self.user = user

    def get_certificates(self) -> List[models.Certificate]:
        return self.db.query(models.Certificate).filter(models.Certificate.user_id == self.user.id).all()

    def get_certificate_by_id(self, certificate_id: str) -> models.Certificate:
        certificate = self.db.query(models.Certificate).filter(
            models.Certificate.id == certificate_id,
            models.Certificate.user_id == self.user.id
        ).first()
        if not certificate:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found")
        return certificate

    def create_certificate(self, certificate_create: schemas.CertificateCreate) -> models.Certificate:
        db_certificate = models.Certificate(**certificate_create.model_dump(), user_id=self.user.id)
        self.db.add(db_certificate)
        self.db.commit()
        self.db.refresh(db_certificate)
        return db_certificate

    def update_certificate(self, certificate_id: str, certificate_update: schemas.CertificateUpdate) -> models.Certificate:
        db_certificate = self.get_certificate_by_id(certificate_id)
        update_data = certificate_update.model_dump(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(db_certificate, key, value)
            
        self.db.commit()
        self.db.refresh(db_certificate)
        return db_certificate

    def delete_certificate(self, certificate_id: str) -> None:
        db_certificate = self.get_certificate_by_id(certificate_id)
        self.db.delete(db_certificate)
        self.db.commit()
