from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "NextJS-FastAPI App"
    API_VERSION: str = "1.0.0"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",    # Next.js development server
        "http://127.0.0.1:3000",    # Next.js localhost
        "http://localhost:8000",    # FastAPI development server
        "http://127.0.0.1:8000",    # FastAPI localhost
    ]
    
    class Config:
        env_file = ".env"

settings = Settings()