from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
import models
from routers.auth import get_current_user

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    total_companies = db.query(models.Company).filter(models.Company.user_id == current_user.id).count()
    total_jobs = db.query(models.Job).filter(models.Job.user_id == current_user.id).count()
    total_resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).count()
    total_certificates = db.query(models.Certificate).filter(models.Certificate.user_id == current_user.id).count()
    
    return {
        "companies": total_companies,
        "jobs": total_jobs,
        "resumes": total_resumes,
        "certificates": total_certificates
    }

@router.get("/pipeline")
def get_dashboard_pipeline(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    status_counts = db.query(models.Job.status, func.count(models.Job.id)).\
        filter(models.Job.user_id == current_user.id).\
        group_by(models.Job.status).all()
        
    pipeline = {status: count for status, count in status_counts}
    return pipeline

@router.get("/activity")
def get_dashboard_activity(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    activities = db.query(models.ActivityLog).filter(models.ActivityLog.user_id == current_user.id).\
        order_by(models.ActivityLog.created_at.desc()).limit(10).all()
    return activities
