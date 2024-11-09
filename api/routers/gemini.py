from fastapi import APIRouter, HTTPException, Body
from typing import List
import os
import json
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
def gemini(articles: str = Body(...)):
    genai.configure(api_key=os.environ["GEMINI_API"])
    model = genai.GenerativeModel(model_name="gemini-1.5-flash",
                                   system_instruction="In the prompt is a JSON of news objects, and a ticker for a crypto coin. Return JSON of a short summary of 4-6 words and a long summary of 15-20 words and any hyperlinks in the values 'short' and 'long' and 'links' in the JSON. The return should only be values those three values, in one return object. If there are no hyperlinks, then 'links' should still be a value but blank. The summaries should focus on how all of the news can affect the specified ticker coin's price in that time area. Include no extra words, no extra characters, and no introductions; make sure it's valid JSON.")
    response = model.generate_content(articles)
    return {"message": response.text}