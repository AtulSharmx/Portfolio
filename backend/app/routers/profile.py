from fastapi import APIRouter, HTTPException, status
from app.schemas.user import UserProfile, UserProfileUpdate
from app.routers import auth

router = APIRouter(prefix="/profile", tags=["User Profile"])

@router.get("/get", response_model=UserProfile)
def get_profile():
    """
    Get user profile data.
    """
    return auth.CURRENT_USER_STATE

@router.patch("/update", response_model=UserProfile)
def update_profile(updates: UserProfileUpdate):
    """
    Partially update user profile parameters (e.g., skills, domains, location, runTime).
    """
    # Apply patches to the global session user
    user = auth.CURRENT_USER_STATE
    
    if updates.name is not None:
        user.name = updates.name
    if updates.course is not None:
        user.course = updates.course
    if updates.email is not None:
        user.email = updates.email
    if updates.domains is not None:
        user.domains = updates.domains
    if updates.skills is not None:
        user.skills = updates.skills
    if updates.location is not None:
        user.location = updates.location
    if updates.runTime is not None:
        user.runTime = updates.runTime

    auth.CURRENT_USER_STATE = user
    return auth.CURRENT_USER_STATE
