import uuid
from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Boolean, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "user"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    companies = relationship("Company", back_populates="user")
    jobs = relationship("Job", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    certificates = relationship("Certificate", back_populates="user")
    activities = relationship("ActivityLog", back_populates="user")

class Company(Base):
    __tablename__ = "company"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("user.id"), index=True, nullable=False)
    name = Column(String(255), nullable=False)
    website = Column(String(255))
    industry = Column(String(255))
    size = Column(String(50))
    location = Column(String(255))
    description = Column(Text)
    linkedin_url = Column(String(1024))
    glassdoor_url = Column(String(1024))
    tech_stack = Column(JSON)
    benefits = Column(JSON)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="companies")
    jobs = relationship("Job", back_populates="company")
    contacts = relationship("CompanyContact", back_populates="company", cascade="all, delete-orphan")
    company_notes = relationship("CompanyNote", back_populates="company", cascade="all, delete-orphan")

class CompanyContact(Base):
    __tablename__ = "company_contact"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    company_id = Column(UUID(as_uuid=False), ForeignKey("company.id"), index=True, nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(255))
    email = Column(String(255))
    linkedin_url = Column(String(1024))
    last_contacted_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    company = relationship("Company", back_populates="contacts")

class CompanyNote(Base):
    __tablename__ = "company_note"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    company_id = Column(UUID(as_uuid=False), ForeignKey("company.id"), index=True, nullable=False)
    content = Column(Text, nullable=False)
    note_type = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    company = relationship("Company", back_populates="company_notes")

class Job(Base):
    __tablename__ = "job"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("user.id"), index=True, nullable=False)
    company_id = Column(UUID(as_uuid=False), ForeignKey("company.id"), index=True, nullable=True)
    resume_id = Column(UUID(as_uuid=False), ForeignKey("resume.id"), index=True, nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    url = Column(String(1024))
    status = Column(String(50), nullable=False, default="interested")
    source = Column(String(255))
    seniority = Column(String(50))
    location = Column(String(255))
    work_model = Column(String(50))
    employment_type = Column(String(50))
    salary_min = Column(Numeric(10, 2))
    salary_max = Column(Numeric(10, 2))
    currency = Column(String(3))
    benefits = Column(JSON)
    deadline = Column(DateTime(timezone=True))
    notes = Column(Text)
    checklist = Column(JSON)
    is_favorite = Column(Boolean, default=False)
    applied_at = Column(DateTime(timezone=True))
    rejection_reason = Column(String(255))
    ats_match_score = Column(Numeric(5, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="jobs")
    company = relationship("Company", back_populates="jobs")
    resume = relationship("Resume", back_populates="jobs")

class Resume(Base):
    __tablename__ = "resume"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("user.id"), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    target_role = Column(String(255))
    content = Column(JSON)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="resumes")
    jobs = relationship("Job", back_populates="resume")

class Certificate(Base):
    __tablename__ = "certificate"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("user.id"), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    institution = Column(String(255))
    category = Column(String(255))
    issue_date = Column(DateTime(timezone=True))
    expiry_date = Column(DateTime(timezone=True))
    credential_id = Column(String(255))
    credential_url = Column(String(1024))
    file_url = Column(String(1024))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="certificates")

class ActivityLog(Base):
    __tablename__ = "activity_log"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("user.id"), index=True, nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(255), nullable=False)
    action = Column(String(255), nullable=False)
    metadata_ = Column("metadata", JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="activities")
