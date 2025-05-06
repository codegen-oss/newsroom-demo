from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.session import engine
from app.models import models
from app.routes import users, organizations, articles, auth

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="News Room API",
    description="API for News Room application",
    version="0.1.0",
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
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(organizations.router, prefix="/api/organizations", tags=["organizations"])
app.include_router(articles.router, prefix="/api/articles", tags=["articles"])

@app.get("/")
async def root():
    return {"message": "Welcome to News Room API"}
