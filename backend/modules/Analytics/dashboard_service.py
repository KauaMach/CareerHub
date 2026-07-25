from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, List, Any
import models

class DashboardService:
    def __init__(self, db: Session, user: models.User):
        self.db = db
        self.user = user

    def get_summary(self) -> Dict[str, int]:
        total_companies = self.db.query(models.Company).filter(models.Company.user_id == self.user.id).count()
        total_jobs = self.db.query(models.Job).filter(models.Job.user_id == self.user.id).count()
        total_resumes = self.db.query(models.Resume).filter(models.Resume.user_id == self.user.id).count()
        total_certificates = self.db.query(models.Certificate).filter(models.Certificate.user_id == self.user.id).count()
        
        return {
            "companies": total_companies,
            "jobs": total_jobs,
            "resumes": total_resumes,
            "certificates": total_certificates
        }

    def get_pipeline(self) -> Dict[str, int]:
        status_counts = self.db.query(models.Job.status, func.count(models.Job.id)).\
            filter(models.Job.user_id == self.user.id).\
            group_by(models.Job.status).all()
            
        pipeline = {status: count for status, count in status_counts}
        return pipeline

    def get_activity(self) -> List[models.ActivityLog]:
        activities = self.db.query(models.ActivityLog).filter(models.ActivityLog.user_id == self.user.id).\
            order_by(models.ActivityLog.created_at.desc()).limit(10).all()
        return activities
