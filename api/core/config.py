# api/core/config.py
from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

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
    
    # Oxylabs credentials
    OXYLABS_USERNAME: str = os.getenv("OXYLABS_USERNAME", "")
    OXYLABS_PASSWORD: str = os.getenv("OXYLABS_PASSWORD", "")
    
    class Config:
        env_file = ".env"
        
    def validate_credentials(self):
        if not self.OXYLABS_USERNAME or not self.OXYLABS_PASSWORD:
            raise ValueError("Missing Oxylabs credentials. Please check your .env file.")
        return True

settings = Settings()