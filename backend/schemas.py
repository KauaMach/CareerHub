from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class CompanyBase(BaseModel):
    name: str
    website: str | None = None
    industry: str | None = None
    location: str | None = None
    notes: str | None = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: str | None = None
    website: str | None = None
    industry: str | None = None
    location: str | None = None
    notes: str | None = None

class CompanyResponse(CompanyBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True

class JobBase(BaseModel):
    company_id: UUID | None = None
    title: str
    description: str | None = None
    url: str | None = None
    status: str = "interested"
    location: str | None = None
    work_model: str | None = None
    salary_min: float | None = None
    salary_max: float | None = None
    currency: str | None = None
    deadline: datetime | None = None
    notes: str | None = None
    checklist: dict | list | None = None
    is_favorite: bool = False
    applied_at: datetime | None = None

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    company_id: UUID | None = None
    title: str | None = None
    description: str | None = None
    url: str | None = None
    status: str | None = None
    location: str | None = None
    work_model: str | None = None
    salary_min: float | None = None
    salary_max: float | None = None
    currency: str | None = None
    deadline: datetime | None = None
    notes: str | None = None
    checklist: dict | list | None = None
    is_favorite: bool | None = None
    applied_at: datetime | None = None

class JobStatusUpdate(BaseModel):
    status: str

class JobResponse(JobBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True
