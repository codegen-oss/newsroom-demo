from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="News Room API",
    description="API for News Room Web Application",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://newsroom-demo.vercel.app",
    ],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the News Room API"}

# Import and include routers
from .auth.router import router as auth_router
from .users.router import router as users_router
from .articles.router import router as articles_router
from .organizations.router import router as organizations_router
from .subscriptions.router import router as subscriptions_router

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(articles_router, prefix="/articles", tags=["Articles"])
app.include_router(organizations_router, prefix="/organizations", tags=["Organizations"])
app.include_router(subscriptions_router, prefix="/subscriptions", tags=["Subscriptions"])
