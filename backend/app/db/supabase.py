import os
import logging
from dotenv import load_dotenv
from supabase import create_client, Client

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load local environment files if present
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        # Real client initialization
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing Supabase client: {e}")
else:
    logger.warning("SUPABASE_URL or SUPABASE_KEY is missing. Backend is running in MOCK mode.")

def get_supabase_client() -> Client:
    """
    Returns the Supabase Client. If credentials are not configured, returns None
    signalling that services should fall back to mock data.
    """
    return supabase
