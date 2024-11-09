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
    articlesList = [Article(**article) for article in json.loads(articles)]
    genai.configure(api_key=os.environ["GEMINI_API"])
    model = genai.GenerativeModel(model_name="gemini-1.5-flash",
                                  system_instruction="Pick your favorite article object out of the array, and return it back in the exact same JSON format without any additional words, explanations, or introductions.")
    response = model.generate_content(articles)
    return {"message": response.text}