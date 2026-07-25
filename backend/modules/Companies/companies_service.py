from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
import models
import schemas

class CompaniesService:
    def __init__(self, db: Session, user: models.User):
        self.db = db
        self.user = user

    def get_companies(self) -> List[models.Company]:
        return self.db.query(models.Company).filter(models.Company.user_id == self.user.id).all()

    def get_company_by_id(self, company_id: str) -> models.Company:
        company = self.db.query(models.Company).filter(
            models.Company.id == company_id,
            models.Company.user_id == self.user.id
        ).first()
        if not company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
        return company

    def create_company(self, company_create: schemas.CompanyCreate) -> models.Company:
        db_company = models.Company(**company_create.model_dump(), user_id=self.user.id)
        self.db.add(db_company)
        self.db.commit()
        self.db.refresh(db_company)
        return db_company

    def update_company(self, company_id: str, company_update: schemas.CompanyUpdate) -> models.Company:
        db_company = self.get_company_by_id(company_id)
        update_data = company_update.model_dump(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(db_company, key, value)
            
        self.db.commit()
        self.db.refresh(db_company)
        return db_company

    def delete_company(self, company_id: str) -> None:
        db_company = self.get_company_by_id(company_id)
        self.db.delete(db_company)
        self.db.commit()
