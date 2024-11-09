from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import users
from .core.config import settings

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