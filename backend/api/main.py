from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="News Room API", description="API for News Room application")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to News Room API"}

# Import and include routers
from .routers import auth, users, articles, organizations, subscriptions

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["User Management"])
app.include_router(articles.router, prefix="/api/articles", tags=["Content"])
app.include_router(organizations.router, prefix="/api/organizations", tags=["Organizations"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["Subscriptions"])

