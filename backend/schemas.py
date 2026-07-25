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
