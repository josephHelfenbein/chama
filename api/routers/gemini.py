from fastapi import APIRouter, HTTPException, Body
from typing import List
import os
import json
from ..schemas.gemini import GeminiRequest

from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.local")

class Article(BaseModel):
    title: str
    description: str | None = None
    source: str
    date: str

router = APIRouter()

@router.post("/")
def gemini(request: GeminiRequest):
    # Extract necessary fields
    messages = request.messages
    ticker = request.ticker
    
    # Format messages as required by the system_instruction
    articles = [{"message_id": m.message_id, "date": m.date, "text": m.text} for m in messages]
    
    # Configure the genai model
    genai.configure(api_key=os.environ["GEMINI_API"])
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
    system_instruction=(
        "In the prompt is a JSON of news objects and a ticker for a crypto coin. "
        "Analyze the news and return a JSON output with a short summary of 4-6 words, a long summary of 15-20 words, "
        "and any hyperlinks, structured as follows:\n\n"
        "{\n"
        '  "short": "4-6 word summary",\n'
        '  "long": "15-20 word summary",\n'
        '  "links": ["https://example1.com", "https://example2.com"]\n'
        "}\n\n"
        "If there are no hyperlinks, set 'links' to an empty list.\n"
        "Focus summaries on how the news could affect the specified ticker coin's price. "
        "Include no extra words, no extra characters, and no introductions; ensure valid JSON."
        )
    )
    
    # Combine articles and ticker for the model input
    model_input = {"articles": articles, "ticker": ticker}
    response = model.generate_content(model_input)
    
    # Return the response in JSON format
    return {"message": response.text}