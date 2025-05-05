"""
Modal application configuration for the Newsroom FastAPI application.
This file configures the Modal container image and web endpoint.
"""

import os
from modal import Image, Stub, asgi_app

# Create a Stub for the Modal application
stub = Stub("newsroom-api")

# Configure the container image with Python 3.9+
# Install all required dependencies for the FastAPI application
image = Image.debian_slim(python_version="3.9").pip_install(
    [
        # Web framework and server
        "fastapi>=0.95.0",
        "uvicorn>=0.21.1",
        
        # Database ORM
        "sqlalchemy>=2.0.0",
        "alembic>=1.10.0",
        
        # Data validation
        "pydantic>=1.10.0",
        
        # Authentication
        "pyjwt>=2.6.0",
        "passlib>=1.7.4",
        "python-jose>=3.3.0",
        "python-multipart>=0.0.6",  # For form data parsing
        
        # HTTP client
        "requests>=2.28.0",
        
        # Additional utilities
        "python-dotenv>=1.0.0",
        "email-validator>=2.0.0",
    ],
    # Use pip's cache to speed up builds and reduce image size
    cache_dir="/root/.cache/pip",
)

# Define the web endpoint
@stub.function(
    image=image,
    # Configure the endpoint for optimal performance
    concurrency=10,  # Allow up to 10 concurrent requests
    timeout=60,      # Set timeout to 60 seconds
    # Mount the application code into the container
    mounts=[],       # Will be configured as needed
)
@asgi_app()
def fastapi_app():
    """
    Serve the FastAPI application through Modal.
    """
    # Import the FastAPI application
    from app.main import app
    return app

# If running directly, serve the application locally for development
if __name__ == "__main__":
    stub.serve()

