from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import api_router
from models import Base
from db import engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="News Room API",
    description="Backend API for the News Room application",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the News Room API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

