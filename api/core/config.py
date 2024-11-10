# api/core/config.py
from pydantic_settings import BaseSettings
from typing import List
from dotenv import load_dotenv
import os
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "NextJS-FastAPI App"
    API_VERSION: str = "1.0.0"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    class Config:
        env_file = ".env"

settings = Settings()