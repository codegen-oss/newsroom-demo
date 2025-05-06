from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import users, articles, organizations
from app.auth import auth_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NewsRoom API",
    description="API for NewsRoom application",
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

# Include routers
app.include_router(auth_router.router, tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(articles.router, prefix="/articles", tags=["Articles"])
app.include_router(organizations.router, prefix="/organizations", tags=["Organizations"])

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to NewsRoom API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

