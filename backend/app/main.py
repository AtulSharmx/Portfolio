from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, profile, matches, tracker, insights

app = FastAPI(
    title="InternHunt API",
    description="FastAPI mock/real backend services for InternHunt - AI internship agent.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for production environments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under prefix '/api'
app.include_router(auth.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(matches.router, prefix="/api")
app.include_router(tracker.router, prefix="/api")
app.include_router(insights.router, prefix="/api")

@app.get("/", tags=["System"])
def root():
    """
    Service health check endpoint.
    """
    return {
        "status": "healthy",
        "service": "InternHunt Backend",
        "mode": "mock",
        "documentation": "/docs"
    }
