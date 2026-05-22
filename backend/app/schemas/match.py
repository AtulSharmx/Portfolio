from pydantic import BaseModel, Field
from typing import List, Optional

class GeneratedMatch(BaseModel):
    id: str
    company: str
    role: str
    stipend: str
    location: str
    matchScore: int = Field(description="Percentage score indicating how well the student fits the role")
    deadline: str
    duration: str
    description: str
    requirements: List[str]
    matchedSkills: List[str]
    missingSkills: List[str]
    coverLetter: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": "1",
                "company": "Razorpay",
                "role": "Frontend Developer Intern",
                "stipend": "₹25,000/month",
                "location": "Remote",
                "matchScore": 92,
                "deadline": "Jun 15, 2026",
                "duration": "6 months",
                "description": "Join our checkout team to build fast, beautiful, and secure payment interfaces.",
                "requirements": ["React", "TypeScript", "JavaScript", "Git"],
                "matchedSkills": ["React", "JavaScript", "Git"],
                "missingSkills": ["TypeScript"],
                "coverLetter": "Dear Hiring Manager, ..."
            }
        }

class MatchListResponse(BaseModel):
    matches: List[GeneratedMatch]
    total: int

class CoverLetterRequest(BaseModel):
    matchId: str
    customInstructions: Optional[str] = Field(None, description="Custom prompt directions to tweak the letter")

class CoverLetterResponse(BaseModel):
    success: bool
    coverLetter: str
