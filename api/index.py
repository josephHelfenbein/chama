from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from .routers import users, gemini
from .core.config import settings
from pydantic import BaseModel


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
app.include_router(gemini.router, prefix="/api/py/gemini", tags=["gemini"])


@app.get("/api/py/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}
