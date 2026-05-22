from fastapi import APIRouter, HTTPException, status
from app.schemas.match import GeneratedMatch, MatchListResponse, CoverLetterRequest, CoverLetterResponse
from app.services.scraper import JobScraper
from app.services.match_engine import MatchEngine
from app.services.cover_letter import CoverLetterGenerator
from app.routers import auth

router = APIRouter(prefix="/matches", tags=["Internship Matches"])

# Services
scraper = JobScraper()
match_engine = MatchEngine()
cover_letter_gen = CoverLetterGenerator()

@router.get("/list", response_model=MatchListResponse)
async def list_matches():
    """
    Scrapes opportunities based on current user domains, computes match scores,
    and returns a sorted list of matched internship listings.
    """
    user = auth.CURRENT_USER_STATE
    
    # Scrape jobs based on user domains
    scraped_jobs = await scraper.scrape_jobs(user.domains)
    
    # Calculate scores and cover letters
    matches = match_engine.calculate_matches(user, scraped_jobs)
    
    return MatchListResponse(
        matches=matches,
        total=len(matches)
    )

@router.get("/{match_id}", response_model=GeneratedMatch)
async def get_match_by_id(match_id: str):
    """
    Retrieve details for a single internship opportunity by its mock ID.
    """
    user = auth.CURRENT_USER_STATE
    scraped_jobs = await scraper.scrape_jobs(user.domains)
    matches = match_engine.calculate_matches(user, scraped_jobs)
    
    # Find match
    match_detail = next((m for m in matches if m.id == match_id), None)
    if not match_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match with ID {match_id} not found"
        )
    
    return match_detail

@router.post("/{match_id}/cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(match_id: str, request: CoverLetterRequest):
    """
    Refine and rewrite the cover letter for a specific internship using Groq AI and optional custom prompt instructions.
    """
    user = auth.CURRENT_USER_STATE
    scraped_jobs = await scraper.scrape_jobs(user.domains)
    matches = match_engine.calculate_matches(user, scraped_jobs)
    
    match_detail = next((m for m in matches if m.id == match_id), None)
    if not match_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match with ID {match_id} not found"
        )
        
    refined_letter = await cover_letter_gen.generate_letter(
        student_name=user.name,
        student_course=user.course,
        company=match_detail.company,
        role=match_detail.role,
        description=match_detail.description,
        matched_skills=match_detail.matchedSkills,
        missing_skills=match_detail.missingSkills,
        custom_instructions=request.customInstructions
    )
    
    return CoverLetterResponse(
        success=True,
        coverLetter=refined_letter
    )
