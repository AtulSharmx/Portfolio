from typing import List, Dict, Any
from datetime import datetime, timedelta
import math
from app.schemas.user import UserProfile
from app.schemas.match import GeneratedMatch

class MatchEngine:
    """
    Port of the frontend's match score calculation and cover letter generation.
    Enables server-side scoring of scraped opportunities against student profiles.
    """

    def calculate_matches(self, user: UserProfile, opportunities: List[Dict[str, Any]]) -> List[GeneratedMatch]:
        matches = []
        student_name = user.name or "John Wick"
        student_course = user.course or "B.Tech Computer Science"
        student_skills = [s.lower() for s in user.skills]
        student_location = user.location or "Remote"

        for index, opt in enumerate(opportunities):
            requirements = opt.get("requirements", [])
            matched = []
            missing = []

            # Check matching skills
            for req in requirements:
                req_lower = req.lower()
                # Simple case-insensitive matching
                has_skill = any(
                    s == req_lower or 
                    (req_lower == "rest apis" and s == "javascript") or 
                    (req_lower == "data analysis" and s == "excel")
                    for s in student_skills
                )
                if has_skill:
                    matched.append(req)
                else:
                    missing.append(req)

            # Match score formula
            ratio = len(matched) / len(requirements) if requirements else 0.8
            # Bound score between 45% and 98%
            match_score = min(98, max(45, round(ratio * 40 + 58)))

            # Location mapping
            locations = ["Remote", "On-site", "Hybrid", "Flexible"]
            if student_location == "Remote":
                location = "Remote" if index % 2 == 0 else locations[index % len(locations)]
            else:
                location = "Remote" if index % 3 == 0 else student_location

            # Format stipend
            base_stipend = opt.get("baseStipend", 20000)
            stipend = f"₹{base_stipend:,}/month"

            # Deadline dates
            deadline_days = [10, 15, 20, 25, 30]
            days_to_add = deadline_days[index % len(deadline_days)]
            deadline_date = datetime.now() + timedelta(days=days_to_add)
            deadline = deadline_date.strftime("%b %d, %Y")

            # Cover letter templating
            matched_str = f"my proficiency in {', '.join(matched)}" if matched else "my background in technology and fast learning pace"
            missing_str = f"I am excited to pick up {', '.join(missing)} rapidly to fit into your technical stack." if missing else "I look forward to jumping into your codebase directly on day one."

            cover_letter = (
                f"Dear Hiring Manager,\n\n"
                f"I am writing to express my strong interest in the {opt.get('role')} position at {opt.get('company')}. "
                f"As a {student_course} student at my college, I have been actively building skills that align closely with the work done by your engineering and product teams.\n\n"
                f"Having looked closely at the requirements for this role, I believe {matched_str} would allow me to hit the ground running. "
                f"I have applied these skills to several academic projects, building fully functional user flows and clean architectures.\n\n"
                f"I am particularly excited about {opt.get('company')} because of your focus on building high-impact products for the Indian market. "
                f"The opportunity to work on products used by millions of customers daily is both challenging and incredibly motivating.\n\n"
                f"{missing_str} I am eager to learn from your experienced developers and make a meaningful contribution to your product goals.\n\n"
                f"Thank you for considering my application. I look forward to discussing how I can add value to the {opt.get('company')} team.\n\n"
                f"Best regards,\n"
                f"{student_name}"
            )

            matches.append(
                GeneratedMatch(
                    id=str(index + 1),
                    company=opt.get("company"),
                    role=opt.get("role"),
                    stipend=stipend,
                    location=location,
                    matchScore=match_score,
                    deadline=deadline,
                    duration=opt.get("duration", "3 months"),
                    description=opt.get("description", ""),
                    requirements=requirements,
                    matchedSkills=matched,
                    missingSkills=missing,
                    coverLetter=cover_letter
                )
            )

        # Sort matches by score descending
        return sorted(matches, key=lambda x: x.matchScore, reverse=True)
