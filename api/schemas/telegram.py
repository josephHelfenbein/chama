# api/schemas/telegram.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class TelegramSearchRequest(BaseModel):
    chat_id: str  # Can be @username or -100123456789
    start_date: datetime
    end_date: Optional[datetime] = None
    limit: Optional[int] = Field(default=100, ge=1, le=1000)
    query: Optional[str] = None  # Optional search term

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class TelegramMessage(BaseModel):
    message_id: int
    date: str
    text: Optional[str] = ""
    from_user: Optional[str] = ""
    reply_to_message_id: Optional[int] = None
    media_type: Optional[str] = None  # photo, video, document, etc.
    media_url: Optional[str] = None

class TelegramSearchResponse(BaseModel):
    messages: List[TelegramMessage] = []
    total_results: int = 0
    
class DialogInfo(BaseModel):
    id: int
    full_id: Optional[str] = None
    title: str
    type: str
    username: Optional[str] = None
    members_count: Optional[int] = None
    is_public: bool = False

class DialogListResponse(BaseModel):
    dialogs: List[DialogInfo]
    
class AuthRequest(BaseModel):
    phone_number: str

class AuthCodeRequest(BaseModel):
    phone_number: str
    code: str
    password: Optional[str] = None  # For 2FA if enabled

class AuthResponse(BaseModel):
    message: str
    phone: str
    requires_code: bool