from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import articles
from .models import article
from .db.database import engine

# Create database tables
article.Base.metadata.create_all(bind=engine)

app = FastAPI(title="News Room API", description="API for News Room application")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(articles.router, prefix="/api", tags=["articles"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the News Room API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

