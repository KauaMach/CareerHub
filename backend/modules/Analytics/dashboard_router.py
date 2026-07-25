from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
import models
from modules.Identity.auth_router import get_current_user
from modules.Analytics.dashboard_service import DashboardService

router = APIRouter()

def get_dashboard_service(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)) -> DashboardService:
    return DashboardService(db, current_user)

@router.get("/summary")
def get_dashboard_summary(service: DashboardService = Depends(get_dashboard_service)):
    return service.get_summary()

@router.get("/pipeline")
def get_dashboard_pipeline(service: DashboardService = Depends(get_dashboard_service)):
    return service.get_pipeline()

@router.get("/activity")
def get_dashboard_activity(service: DashboardService = Depends(get_dashboard_service)):
    return service.get_activity()
