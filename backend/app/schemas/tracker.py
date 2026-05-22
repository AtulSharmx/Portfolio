from pydantic import BaseModel, Field
from typing import List, Literal, Optional

ApplicationStatus = Literal["applied", "heard-back", "rejected"]

class Application(BaseModel):
    id: str
    company: str
    role: str
    dateApplied: str = Field(description="Formatted date, e.g., 'Dec 10, 2024'")
    status: ApplicationStatus

    class Config:
        json_schema_extra = {
            "example": {
                "id": "app-12345",
                "company": "Razorpay",
                "role": "Frontend Developer Intern",
                "dateApplied": "Dec 10, 2024",
                "status": "applied"
            }
        }

class ApplicationCreate(BaseModel):
    company: str = Field(..., min_length=1)
    role: str = Field(..., min_length=1)

class ApplicationUpdateStatus(BaseModel):
    status: ApplicationStatus

class TrackerStats(BaseModel):
    total: int
    applied: int
    heardBack: int = Field(alias="heardBack")
    rejected: int
    responseRate: int = Field(alias="responseRate")

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "total": 3,
                "applied": 1,
                "heardBack": 1,
                "rejected": 1,
                "responseRate": 33
            }
        }
