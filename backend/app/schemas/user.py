from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class UserProfile(BaseModel):
    name: str = Field(default="John Wick", description="Full name of the student")
    course: str = Field(default="B.Tech Computer Science", description="Course/degree of study")
    email: str = Field(default="john.wick@college.edu.in", description="Email address")
    domains: List[str] = Field(default_factory=lambda: ["Web Dev", "ML/AI"], description="Preferred internship domains")
    skills: List[str] = Field(default_factory=lambda: ["React", "JavaScript", "Python", "Git"], description="Current student skills")
    location: str = Field(default="Remote", description="Preferred location setting (Remote, On-site, Hybrid, Flexible)")
    runTime: str = Field(default="9 AM", description="Agent daily run time preset")
    createdAt: Optional[str] = Field(default=None, description="ISO timestamp of creation")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Wick",
                "course": "B.Tech Computer Science",
                "email": "john.wick@college.edu.in",
                "domains": ["Web Dev", "ML/AI"],
                "skills": ["React", "JavaScript", "Python", "Git"],
                "location": "Remote",
                "runTime": "9 AM",
                "createdAt": "2026-05-21T12:00:00Z"
            }
        }

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    course: Optional[str] = None
    email: Optional[str] = None
    domains: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    location: Optional[str] = None
    runTime: Optional[str] = None

class AuthRequest(BaseModel):
    email: str
    password: Optional[str] = None

class AuthResponse(BaseModel):
    success: bool
    message: str
    user: Optional[UserProfile] = None
    token: Optional[str] = None
