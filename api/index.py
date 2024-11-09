from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from .routers import users
from .core.config import settings
import json
import google.generativeai as genai
from pydantic import BaseModel
import os
from dotenv import load_dotenv
class Article(BaseModel):
    title: str
    description: str | None = None
    source: str
    date: str


app = FastAPI(
    title=settings.PROJECT_NAME,
    docs_url="/api/py/docs",
    openapi_url="/api/py/openapi.json"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/py/users", tags=["users"])

@app.get("/api/py/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}

load_dotenv(dotenv_path=".env.local")

@app.post("/api/py/gemini")
def gemini(articles: str = Body(...)):
    articlesList = [Article(**article) for article in json.loads(articles)]
    genai.configure(api_key=os.environ["GEMINI_API"])
    model = genai.GenerativeModel(model_name="gemini-1.5-flash",
                                  system_instruction="Pick your favorite article object out of the array, and return it back in the exact same JSON format without any additional words, explanations, or introductions.")
    response = model.generate_content(articles)
    return {"message": response.text}