from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime

class Message(BaseModel):
    message_id: int
    date: datetime
    text: str
    from_user: str
    reply_to_message_id: Optional[int] = None
    media_type: Optional[str] = None
    media_url: Optional[HttpUrl] = None

class GeminiRequest(BaseModel):
    messages: List[Message]
    total_results: int
    ticker: str  # Add the 'ticker' field for the cryptocurrency ticker.