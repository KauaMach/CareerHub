from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
from modules.Identity.auth_router import get_current_user
from modules.Documents.certificates_service import CertificatesService

router = APIRouter()

def get_certificates_service(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)) -> CertificatesService:
    return CertificatesService(db, current_user)

@router.get("/", response_model=List[schemas.CertificateResponse])
def get_certificates(service: CertificatesService = Depends(get_certificates_service)):
    return service.get_certificates()

@router.post("/", response_model=schemas.CertificateResponse, status_code=status.HTTP_201_CREATED)
def create_certificate(certificate: schemas.CertificateCreate, service: CertificatesService = Depends(get_certificates_service)):
    return service.create_certificate(certificate)

@router.get("/{certificate_id}", response_model=schemas.CertificateResponse)
def get_certificate(certificate_id: str, service: CertificatesService = Depends(get_certificates_service)):
    return service.get_certificate_by_id(certificate_id)

@router.patch("/{certificate_id}", response_model=schemas.CertificateResponse)
def update_certificate(certificate_id: str, certificate_update: schemas.CertificateUpdate, service: CertificatesService = Depends(get_certificates_service)):
    return service.update_certificate(certificate_id, certificate_update)

@router.delete("/{certificate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certificate(certificate_id: str, service: CertificatesService = Depends(get_certificates_service)):
    service.delete_certificate(certificate_id)
    return None
