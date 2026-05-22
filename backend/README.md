# InternHunt Backend (FastAPI)

FastAPI-powered backend services for InternHunt. Built with Python 3.10+, FastAPI, Supabase, and Groq.

## Project Structure

```text
backend/
├── app/
│   ├── db/
│   │   └── supabase.py       # Supabase database client stub
│   ├── routers/
│   │   ├── auth.py           # Mock auth endpoints (login, register, me)
│   │   ├── insights.py       # Mock skill gap analysis
│   │   ├── matches.py        # Mock internship match engine & cover letter builder
│   │   ├── profile.py        # Mock profile get/update endpoints
│   │   └── tracker.py        # Mock application tracking log
│   ├── schemas/
│   │   ├── user.py           # Pydantic schemas for users
│   │   ├── match.py          # Pydantic schemas for internship opportunities
│   │   └── tracker.py        # Pydantic schemas for tracking logs
│   ├── services/
│   │   ├── cover_letter.py   # AI cover letter generator stub
│   │   ├── match_engine.py   # Python port of match algorithm
│   │   └── scraper.py        # Web scraper placeholder
│   └── main.py               # Application entrypoint
├── .env.example
├── README.md
└── requirements.txt
```

## Setup Instructions

### 1. Create a Virtual Environment
From the `/backend` directory, initialize a python virtual environment:

#### Windows (PowerShell/CMD):
```powershell
python -m venv venv
venv\Scripts\activate
```

#### macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
Ensure your virtual environment is active and install the packages listed in `requirements.txt`:
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in the required api credentials:
```bash
cp .env.example .env
```

### 4. Run the Dev Server
Start the development server using `uvicorn`:
```bash
uvicorn app.main:app --reload
```

Once running, you can access:
* **API Documentation (Swagger UI):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **Alternative Documentation (Redoc):** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
