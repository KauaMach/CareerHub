from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
from modules.Identity.auth_router import get_current_user
from modules.Companies.companies_service import CompaniesService

router = APIRouter()

def get_companies_service(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)) -> CompaniesService:
    return CompaniesService(db, current_user)

@router.get("/", response_model=List[schemas.CompanyResponse])
def get_companies(service: CompaniesService = Depends(get_companies_service)):
    return service.get_companies()

@router.post("/", response_model=schemas.CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(company: schemas.CompanyCreate, service: CompaniesService = Depends(get_companies_service)):
    return service.create_company(company)

@router.get("/{company_id}", response_model=schemas.CompanyResponse)
def get_company(company_id: str, service: CompaniesService = Depends(get_companies_service)):
    return service.get_company_by_id(company_id)

@router.patch("/{company_id}", response_model=schemas.CompanyResponse)
def update_company(company_id: str, company_update: schemas.CompanyUpdate, service: CompaniesService = Depends(get_companies_service)):
    return service.update_company(company_id, company_update)

@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(company_id: str, service: CompaniesService = Depends(get_companies_service)):
    service.delete_company(company_id)
    return None
