from pydantic import BaseModel, Field
from typing import List, Optional, Union
from datetime import datetime

class NewsSearchRequest(BaseModel):
    keywords: Union[str, List[str]]
    start_date: datetime
    end_date: Optional[datetime] = None  # If not provided, will default to current time
    limit: Optional[int] = Field(default=10, ge=1, le=100)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class NewsArticle(BaseModel):
    url: str
    title: str
    desc: Optional[str] = ""
    source: str
    publish_date: Optional[str] = ""

    class Config:
        from_attributes = True

class NewsSearchResponse(BaseModel):
    articles: List[NewsArticle] = []
    total_results: int = 0

    class Config:
        from_attributes = True