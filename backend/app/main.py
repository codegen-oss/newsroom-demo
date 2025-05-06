from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, users, password_reset
from app.models.models import Base
from app.database import engine

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="News Room API",
    description="API for News Room application with authentication",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(password_reset.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the News Room API"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

