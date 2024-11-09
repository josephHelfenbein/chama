from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas.user import UserCreate, UserResponse

router = APIRouter()

@router.get("/")
async def get_users():
    """Example endpoint to test the router"""
    return {"message": "Users endpoint working"}

@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate):
    return {"id": 1, "username": user.username, "email": user.email}