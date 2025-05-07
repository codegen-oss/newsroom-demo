from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .database.database import engine, Base
from .routers import users, articles, organizations
from .auth import auth

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="News Room API",
    description="API for News Room Web Application",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(articles.router, prefix="/articles", tags=["Articles"])
app.include_router(organizations.router, prefix="/organizations", tags=["Organizations"])

@app.get("/")
async def root():
    return {"message": "Welcome to the News Room API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

