"""Application settings, loaded from environment variables / .env.

Kept intentionally small: this is a basic local backend, not a
multi-environment production config system.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "Yatra AI API"
    DESCRIPTION: str = "Basic backend API for Yatra AI personalized tourism planner"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./yatra_ai.db")

    # Comma-separated origins; defaults to the Vite dev server.
    _frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    CORS_ORIGINS: list[str] = [origin.strip() for origin in _frontend_url.split(",") if origin.strip()]


settings = Settings()
