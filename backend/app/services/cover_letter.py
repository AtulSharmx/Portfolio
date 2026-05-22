import os
import logging
from typing import Optional, List
from groq import Groq

logger = logging.getLogger(__name__)

class CoverLetterGenerator:
    """
    Service for writing and updating cover letters.
    Integrates with Groq API for LLM-based custom generation, with local templated fallbacks.
    """

    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if api_key:
            try:
                self.client = Groq(api_key=api_key)
                logger.info("Groq client initialized for AI cover letter generation.")
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {e}")
                self.client = None
        else:
            self.client = None
            logger.warning("GROQ_API_KEY is not set. Using templated cover letters.")

    async def generate_letter(
        self,
        student_name: str,
        student_course: str,
        company: str,
        role: str,
        description: str,
        matched_skills: List[str],
        missing_skills: List[str],
        custom_instructions: Optional[str] = None
    ) -> str:
        """
        Generates a custom cover letter. Uses Groq LLM if available, otherwise returns template.
        """
        if self.client:
            try:
                prompt = (
                    f"Write a professional internship cover letter for a student applying to a role.\n"
                    f"Applicant Name: {student_name}\n"
                    f"Applicant Course/Degree: {student_course}\n"
                    f"Target Company: {company}\n"
                    f"Target Role: {role}\n"
                    f"Job Description: {description}\n"
                    f"Skills applicant has that match requirements: {', '.join(matched_skills)}\n"
                    f"Required skills applicant is missing/willing to learn: {', '.join(missing_skills)}\n"
                )

                if custom_instructions:
                    prompt += f"Additional requests/tone modifications: {custom_instructions}\n"

                prompt += (
                    "\nRequirements:\n"
                    "- Keep it under 250 words.\n"
                    "- Do not include placeholders like [Insert Date] or bracketed text.\n"
                    "- Sound professional, eager, and tailored specifically to the Indian tech ecosystem if appropriate.\n"
                    "- Write ONLY the cover letter body text, beginning with 'Dear Hiring Manager,' and ending with the applicant's name."
                )

                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {
                            "role": "system",
                            "content": "You are an expert career advisor and technical copywriter assisting Indian college students in landing internships."
                        },
                        {
                            "role": "user",
                            "content": prompt,
                        }
                    ],
                    model="llama3-8b-8192",
                    temperature=0.7,
                    max_tokens=500
                )
                
                content = chat_completion.choices[0].message.content
                if content:
                    return content.strip()

            except Exception as e:
                logger.error(f"Error calling Groq completion: {e}. Falling back to template.")

        # Local Template Fallback
        matched_str = f"my proficiency in {', '.join(matched_skills)}" if matched_skills else "my background in technology and fast learning pace"
        missing_str = f"I am excited to pick up {', '.join(missing_skills)} rapidly to fit into your technical stack." if missing_skills else "I look forward to jumping into your codebase directly on day one."
        
        custom_note = f"\n\n(Note: Added custom directives: '{custom_instructions}')" if custom_instructions else ""

        letter = (
            f"Dear Hiring Manager,\n\n"
            f"I am writing to express my strong interest in the {role} position at {company}. "
            f"As a {student_course} student at my college, I have been actively building skills that align closely with the work done by your engineering and product teams.\n\n"
            f"Having looked closely at the requirements for this role, I believe {matched_str} would allow me to hit the ground running. "
            f"I have applied these skills to several academic projects, building fully functional user flows and clean architectures.\n\n"
            f"I am particularly excited about {company} because of your focus on building high-impact products for the Indian market. "
            f"The opportunity to work on products used by millions of customers daily is both challenging and incredibly motivating.\n\n"
            f"{missing_str} I am eager to learn from your experienced developers and make a meaningful contribution to your product goals.{custom_note}\n\n"
            f"Thank you for considering my application. I look forward to discussing how I can add value to the {company} team.\n\n"
            f"Best regards,\n"
            f"{student_name}"
        )
        return letter
