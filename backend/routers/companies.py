from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
from routers.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.CompanyResponse])
def get_companies(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    companies = db.query(models.Company).filter(models.Company.user_id == current_user.id).all()
    return companies

@router.post("/", response_model=schemas.CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(company: schemas.CompanyCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_company = models.Company(**company.model_dump(), user_id=current_user.id)
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

@router.get("/{company_id}", response_model=schemas.CompanyResponse)
def get_company(company_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    company = db.query(models.Company).filter(
        models.Company.id == company_id,
        models.Company.user_id == current_user.id
    ).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return company

@router.patch("/{company_id}", response_model=schemas.CompanyResponse)
def update_company(company_id: str, company_update: schemas.CompanyUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_company = db.query(models.Company).filter(
        models.Company.id == company_id,
        models.Company.user_id == current_user.id
    ).first()
    if not db_company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    
    update_data = company_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_company, key, value)
        
    db.commit()
    db.refresh(db_company)
    return db_company

@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(company_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_company = db.query(models.Company).filter(
        models.Company.id == company_id,
        models.Company.user_id == current_user.id
    ).first()
    if not db_company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    
    db.delete(db_company)
    db.commit()
    return None
