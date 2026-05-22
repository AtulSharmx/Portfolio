from fastapi import APIRouter, HTTPException, status
from app.schemas.tracker import Application, ApplicationCreate, ApplicationUpdateStatus, TrackerStats
from typing import List
from datetime import datetime
import uuid

router = APIRouter(prefix="/tracker", tags=["Application Tracker"])

# Mock database list for tracked applications
MOCK_APPLICATIONS: List[Application] = [
    Application(id="1", company="Razorpay", role="Web Developer Intern", dateApplied="Dec 10, 2024", status="applied"),
    Application(id="2", company="Swiggy", role="Software Engineering Intern", dateApplied="Dec 08, 2024", status="heard-back"),
    Application(id="3", company="Zomato", role="Backend Developer Intern", dateApplied="Dec 05, 2024", status="rejected"),
]

@router.get("/list", response_model=List[Application])
def list_applications():
    """
    Get all tracked applications for the user.
    """
    return MOCK_APPLICATIONS

@router.get("/stats", response_model=TrackerStats)
def get_tracker_stats():
    """
    Retrieve aggregated stats (total, applied, heard back, rejected, response rate).
    """
    total = len(MOCK_APPLICATIONS)
    applied = sum(1 for a in MOCK_APPLICATIONS if a.status == "applied")
    heard_back = sum(1 for a in MOCK_APPLICATIONS if a.status == "heard-back")
    rejected = sum(1 for a in MOCK_APPLICATIONS if a.status == "rejected")
    
    response_rate = int((heard_back / total) * 100) if total > 0 else 0
    
    # We serialize with aliases so we return heardBack, responseRate correctly
    return TrackerStats(
        total=total,
        applied=applied,
        heardBack=heard_back,
        rejected=rejected,
        responseRate=response_rate
    )

@router.post("/add", response_model=Application, status_code=status.HTTP_201_CREATED)
def add_application(payload: ApplicationCreate):
    """
    Log a new internship application.
    Status defaults to 'applied', dateApplied is set to today.
    """
    new_app = Application(
        id=f"app-{uuid.uuid4().hex[:8]}",
        company=payload.company,
        role=payload.role,
        dateApplied=datetime.now().strftime("%b %d, %Y"),
        status="applied"
    )
    MOCK_APPLICATIONS.insert(0, new_app)
    return new_app

@router.patch("/{app_id}/status", response_model=Application)
def update_application_status(app_id: str, payload: ApplicationUpdateStatus):
    """
    Update the status of an existing internship application in the pipeline.
    """
    app = next((a for a in MOCK_APPLICATIONS if a.id == app_id), None)
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID {app_id} not found"
        )
    
    app.status = payload.status
    return app
