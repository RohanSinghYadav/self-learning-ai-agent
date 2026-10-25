import os
from pathlib import Path
from dotenv import load_dotenv

# Project root .env file load
PROJECT_ROOT = Path(__file__).resolve().parents[2]
ENV_FILE = PROJECT_ROOT / ".env"

load_dotenv(ENV_FILE, override=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        f"GEMINI_API_KEY missing. Check this file: {ENV_FILE}"
    )
