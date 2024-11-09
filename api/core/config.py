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
    
    # Oxylabs credentials
    OXYLABS_USERNAME: str = ""
    OXYLABS_PASSWORD: str = ""
    
    # Telegram API credentials
    TELEGRAM_API_ID: int
    TELEGRAM_API_HASH: str
    
    # Telegram session management
    SESSION_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "sessions")
    SESSION_NAME: str = "telegram_session"    

    class Config:
        env_file = ".env"

settings = Settings()