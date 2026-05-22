from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.user import AuthRequest, AuthResponse, UserProfile
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Dummy in-memory session user representing state
CURRENT_USER_STATE = UserProfile(
    name="John Wick",
    course="B.Tech Computer Science",
    email="john.wick@college.edu.in",
    domains=["Web Dev", "ML/AI"],
    skills=["React", "JavaScript", "Python", "Git"],
    location="Remote",
    runTime="9 AM",
    createdAt=datetime.now().isoformat()
)

@router.post("/login", response_model=AuthResponse)
def login(payload: AuthRequest):
    """
    Mock user login endpoint.
    Accepts email and sets up a mock session.
    """
    if not payload.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is required"
        )
    
    # Update global mock user email to what was entered
    global CURRENT_USER_STATE
    CURRENT_USER_STATE.email = payload.email
    
    return AuthResponse(
        success=True,
        message="Logged in successfully (MOCK)",
        user=CURRENT_USER_STATE,
        token="mock-jwt-session-token-xyz"
    )

@router.post("/register", response_model=AuthResponse)
def register(user_profile: UserProfile):
    """
    Mock user registration / onboarding endpoint.
    Saves onboarding details to the server-side mock state.
    """
    global CURRENT_USER_STATE
    CURRENT_USER_STATE = user_profile
    CURRENT_USER_STATE.createdAt = datetime.now().isoformat()
    
    return AuthResponse(
        success=True,
        message="User onboarded successfully (MOCK)",
        user=CURRENT_USER_STATE,
        token="mock-jwt-session-token-xyz"
    )

@router.get("/me", response_model=UserProfile)
def get_current_user():
    """
    Mock fetch of the currently logged-in user profile.
    """
    return CURRENT_USER_STATE
