from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, users, organizations

app = FastAPI(
    title="News Room API",
    description="API for News Room application",
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
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(organizations.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the News Room API"}

# Add startup event to create tables if they don't exist
@app.on_event("startup")
def startup_db_client():
    # This is handled by Alembic migrations
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

