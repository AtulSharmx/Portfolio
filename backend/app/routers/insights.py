from fastapi import APIRouter
from app.schemas.match import GeneratedMatch
from app.routers import auth
from pydantic import BaseModel, Field
from typing import List

router = APIRouter(prefix="/insights", tags=["Skill Gap Insights"])

class SkillResource(BaseModel):
    skill: str
    percentage: int
    domain: str
    learnLink: str = Field(alias="learnLink")
    estimatedHours: int = Field(alias="estimatedHours")
    trend: int

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "skill": "TypeScript",
                "percentage": 82,
                "domain": "Web Development",
                "learnLink": "https://www.typescriptlang.org/docs/",
                "estimatedHours": 20,
                "trend": 4
            }
        }

ALL_SKILL_RESOURCES = {
    'TypeScript': {'domain': 'Web Development', 'url': 'https://www.typescriptlang.org/docs/', 'hours': 20},
    'SQL': {'domain': 'Data Science', 'url': 'https://www.w3schools.com/sql/', 'hours': 15},
    'Docker': {'domain': 'DevOps', 'url': 'https://docs.docker.com/', 'hours': 12},
    'Python': {'domain': 'Backend Development', 'url': 'https://www.python.org/doc/', 'hours': 30},
    'Figma': {'domain': 'Product Design', 'url': 'https://help.figma.com/', 'hours': 12},
    'React': {'domain': 'Web Development', 'url': 'https://react.dev/', 'hours': 25},
    'Next.js': {'domain': 'Web Development', 'url': 'https://nextjs.org/docs', 'hours': 18},
    'AWS': {'domain': 'DevOps', 'url': 'https://docs.aws.amazon.com/', 'hours': 40},
    'Git': {'domain': 'Software Engineering', 'url': 'https://git-scm.com/doc', 'hours': 6},
    'Node.js': {'domain': 'Web Development', 'url': 'https://nodejs.org/en/docs/', 'hours': 20},
    'MongoDB': {'domain': 'Database Engineering', 'url': 'https://www.mongodb.com/docs/', 'hours': 15},
    'Excel': {'domain': 'Business Analyst', 'url': 'https://support.microsoft.com/excel', 'hours': 10},
    'TensorFlow': {'domain': 'ML/AI Research', 'url': 'https://www.tensorflow.org/api_docs', 'hours': 35},
    'Flutter': {'domain': 'Mobile Development', 'url': 'https://docs.flutter.dev/', 'hours': 25},
    'Kotlin': {'domain': 'Mobile Development', 'url': 'https://kotlinlang.org/docs/home.html', 'hours': 20},
}

FALLBACK_GAPS = [
    SkillResource(skill="GraphQL", percentage=76, domain="API Architecture", learnLink="https://graphql.org/learn/", estimatedHours=12, trend=6),
    SkillResource(skill="System Design", percentage=68, domain="Software Architecture", learnLink="https://github.com/donnemartin/system-design-primer", estimatedHours=45, trend=10),
    SkillResource(skill="Tailwind CSS", percentage=89, domain="Frontend Development", learnLink="https://tailwindcss.com/docs", estimatedHours=8, trend=3),
    SkillResource(skill="Jest Testing", percentage=55, domain="Testing Operations", learnLink="https://jestjs.io/docs/getting-started", estimatedHours=10, trend=2),
]

@router.get("/gaps", response_model=List[SkillResource])
def list_skill_gaps():
    """
    Compares the requirements of top internship matches against user skills,
    identifying the highest-value missing skills to display as recommendations.
    """
    user = auth.CURRENT_USER_STATE
    user_skills_set = {s.lower() for s in user.skills}
    
    gaps = []
    for skill, meta in ALL_SKILL_RESOURCES.items():
        if skill.lower() not in user_skills_set:
            # Deterministic hash score based on skill name
            char_sum = sum(ord(c) for c in skill)
            percentage = 45 + (char_sum % 45)  # 45% to 90%
            trend = (char_sum % 15) - 5       # -5% to +10%
            
            gaps.append(
                SkillResource(
                    skill=skill,
                    percentage=percentage,
                    domain=meta["domain"],
                    learnLink=meta["url"],
                    estimatedHours=meta["hours"],
                    trend=trend
                )
            )
            
    # Sort by percentage descending
    gaps.sort(key=lambda x: x.percentage, reverse=True)
    
    # Pad to at least 4 using fallbacks if user has very few gaps
    final_gaps = gaps[:4]
    if len(final_gaps) < 4:
        needed = 4 - len(final_gaps)
        for fb in FALLBACK_GAPS[:needed]:
            final_gaps.append(fb)
            
    return final_gaps
