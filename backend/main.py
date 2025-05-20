"""
Main FastAPI application for the News Room backend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import database models
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import Base, engine

# Import routers
from routers import users, articles, auth, organizations

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="News Room API",
    description="API for the News Room application",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(users.router, prefix="/api", tags=["Users"])
app.include_router(articles.router, prefix="/api", tags=["Articles"])
app.include_router(organizations.router, prefix="/api", tags=["Organizations"])

@app.get("/")
async def root():
    return {"message": "Welcome to the News Room API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

