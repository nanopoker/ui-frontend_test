from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import uvicorn

app = FastAPI(title="Champ Code Academy API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://nanopoker.github.io",
        "https://*.github.io",  # Allow all GitHub Pages subdomains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock lesson data
LESSONS_DATA = [
    {
        "id": "L001",
        "date": "2025-10-28T14:00:00Z",
        "type": "Historic",
        "subject": "Minecraft Game Design - Level 1",
        "students": ["Ethan", "Ava"],
        "tutor": "Sarah Tan",
        "status": "Completed"
    },
    {
        "id": "L002",
        "date": "2025-11-02T09:00:00Z",
        "type": "Historic",
        "subject": "Roblox Coding Basics",
        "students": ["Lucas"],
        "tutor": "Sarah Tan",
        "status": "Completed"
    },
    {
        "id": "L003",
        "date": "2025-11-05T16:00:00Z",
        "type": "Historic",
        "subject": "Python for Kids - Introduction",
        "students": ["Chloe", "Aaron"],
        "tutor": "Sarah Tan",
        "status": "Completed"
    },
    {
        "id": "L004",
        "date": "2025-11-08T10:00:00Z",
        "type": "Upcoming",
        "subject": "Minecraft Redstone Logic",
        "students": ["Emma", "Noah"],
        "tutor": "Sarah Tan",
        "status": "Confirmed"
    },
    {
        "id": "L005",
        "date": "2025-11-09T15:00:00Z",
        "type": "Upcoming",
        "subject": "Roblox Game Design - Level 2",
        "students": ["Ryan", "Mia"],
        "tutor": "Sarah Tan",
        "status": "Confirmed"
    },
    {
        "id": "L006",
        "date": "2025-11-10T12:00:00Z",
        "type": "Upcoming",
        "subject": "Website Design for Beginners",
        "students": ["Olivia"],
        "tutor": "Sarah Tan",
        "status": "Confirmed"
    },
    {
        "id": "L007",
        "date": "2025-11-12T11:00:00Z",
        "type": "Available",
        "subject": "Python for Kids - Game Projects",
        "students": [],
        "tutor": None,
        "status": "Available"
    },
    {
        "id": "L008",
        "date": "2025-11-13T17:00:00Z",
        "type": "Available",
        "subject": "Roblox Game Design - Level 1",
        "students": [],
        "tutor": None,
        "status": "Available"
    },
    {
        "id": "L009",
        "date": "2025-11-14T10:00:00Z",
        "type": "Available",
        "subject": "Minecraft AI Coding Adventure",
        "students": [],
        "tutor": None,
        "status": "Available"
    },
    {
        "id": "L010",
        "date": "2025-11-15T09:00:00Z",
        "type": "Upcoming",
        "subject": "Python Automation for Kids",
        "students": ["Elijah"],
        "tutor": "Sarah Tan",
        "status": "Confirmed"
    }
]

# In-memory storage for lessons (to allow updates)
lessons_storage = LESSONS_DATA.copy()


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    success: bool
    message: str
    tutor: Optional[dict] = None
    token: Optional[str] = None


class TakeClassRequest(BaseModel):
    lessonId: str
    tutorName: str


@app.get("/")
def root():
    return {"message": "Champ Code Academy API"}


@app.post("/api/login", response_model=LoginResponse)
def login(credentials: LoginRequest):
    """Mock login endpoint - accepts any credentials"""
    # Simulate authentication delay
    if credentials.email and credentials.password:
        return LoginResponse(
            success=True,
            message="Login successful",
            tutor={
                "name": "Sarah Tan",
                "email": credentials.email
            },
            token="mock_jwt_token_12345"
        )
    raise HTTPException(status_code=400, detail="Invalid credentials")


@app.get("/api/lessons")
def get_lessons():
    """Get all lessons"""
    return lessons_storage


@app.post("/api/lessons/take")
def take_class(request: TakeClassRequest):
    """Take an available class"""
    lesson = next((l for l in lessons_storage if l["id"] == request.lessonId), None)
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    if lesson["type"] != "Available":
        raise HTTPException(status_code=400, detail="Lesson is not available")
    
    # Update lesson to Upcoming
    lesson["type"] = "Upcoming"
    lesson["tutor"] = request.tutorName
    lesson["status"] = "Confirmed"
    
    return {"success": True, "message": "Class taken successfully", "lesson": lesson}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

