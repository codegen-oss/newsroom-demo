from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, articles, organizations
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="NewsRoom API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(articles.router)
app.include_router(organizations.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the NewsRoom API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

