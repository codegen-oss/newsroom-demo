from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.openapi.utils import get_openapi
from .database.database import engine, Base
from .routers import users, articles, organizations
from .auth import auth

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="News Room API",
    description="""
    # News Room API Documentation
    
    This API provides endpoints for the News Room Web Application, a news aggregation platform 
    focusing on geopolitics, economy, and technology with tiered access levels.
    
    ## Features
    
    * User authentication and management
    * Article creation, retrieval, and management
    * Organization management
    * Tiered access control (free, premium, organization)
    
    ## Authentication
    
    Most endpoints require authentication using JWT tokens. To authenticate:
    
    1. Obtain a token using the `/token` endpoint
    2. Include the token in the Authorization header: `Authorization: Bearer {token}`
    """,
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
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
    """
    Root endpoint that returns a welcome message.
    
    Returns:
        dict: A welcome message
    """
    return {"message": "Welcome to the News Room API"}

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify the API is running.
    
    Returns:
        dict: A status message indicating the API is healthy
    """
    return {"status": "healthy"}

# Custom OpenAPI and documentation endpoints
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    """
    Custom Swagger UI endpoint.
    """
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
    )

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    """
    ReDoc documentation endpoint.
    """
    return get_redoc_html(
        openapi_url="/openapi.json",
        title=app.title + " - ReDoc",
        redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js",
    )

@app.get("/openapi.json", include_in_schema=False)
async def get_open_api_endpoint():
    """
    OpenAPI schema endpoint.
    """
    return get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
