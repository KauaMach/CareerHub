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
    size: str | None = None
    location: str | None = None
    description: str | None = None
    linkedin_url: str | None = None
    glassdoor_url: str | None = None
    tech_stack: dict | list | None = None
    benefits: dict | list | None = None
    notes: str | None = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: str | None = None
    website: str | None = None
    industry: str | None = None
    size: str | None = None
    location: str | None = None
    description: str | None = None
    linkedin_url: str | None = None
    glassdoor_url: str | None = None
    tech_stack: dict | list | None = None
    benefits: dict | list | None = None
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
    resume_id: UUID | None = None
    title: str
    description: str | None = None
    url: str | None = None
    status: str = "interested"
    source: str | None = None
    seniority: str | None = None
    location: str | None = None
    work_model: str | None = None
    employment_type: str | None = None
    salary_min: float | None = None
    salary_max: float | None = None
    currency: str | None = None
    benefits: dict | list | None = None
    deadline: datetime | None = None
    notes: str | None = None
    checklist: dict | list | None = None
    is_favorite: bool = False
    applied_at: datetime | None = None
    rejection_reason: str | None = None
    ats_match_score: float | None = None

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    company_id: UUID | None = None
    resume_id: UUID | None = None
    title: str | None = None
    description: str | None = None
    url: str | None = None
    status: str | None = None
    source: str | None = None
    seniority: str | None = None
    location: str | None = None
    work_model: str | None = None
    employment_type: str | None = None
    salary_min: float | None = None
    salary_max: float | None = None
    currency: str | None = None
    benefits: dict | list | None = None
    deadline: datetime | None = None
    notes: str | None = None
    checklist: dict | list | None = None
    is_favorite: bool | None = None
    applied_at: datetime | None = None
    rejection_reason: str | None = None
    ats_match_score: float | None = None

class JobStatusUpdate(BaseModel):
    status: str

class JobResponse(JobBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True

class ResumeBase(BaseModel):
    title: str
    target_role: str | None = None
    content: dict | list | None = None
    is_default: bool = False

class ResumeCreate(ResumeBase):
    pass

class ResumeUpdate(BaseModel):
    title: str | None = None
    target_role: str | None = None
    content: dict | list | None = None
    is_default: bool | None = None

class ResumeResponse(ResumeBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True

class CertificateBase(BaseModel):
    title: str
    institution: str | None = None
    category: str | None = None
    issue_date: datetime | None = None
    expiry_date: datetime | None = None
    credential_id: str | None = None
    credential_url: str | None = None
    file_url: str | None = None

class CertificateCreate(CertificateBase):
    pass

class CertificateUpdate(BaseModel):
    title: str | None = None
    institution: str | None = None
    category: str | None = None
    issue_date: datetime | None = None
    expiry_date: datetime | None = None
    credential_id: str | None = None
    credential_url: str | None = None
    file_url: str | None = None

class CertificateResponse(CertificateBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True
