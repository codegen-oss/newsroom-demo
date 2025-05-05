from modal import Image, Secret, Stub, web_endpoint

# Create a Stub for the News Room API
stub = Stub("newsroom-api")

# Create an image with the required dependencies
image = (
    Image.debian_slim()
    .pip_install("fastapi", "uvicorn", "pydantic", "httpx", "python-jose[cryptography]", 
                 "passlib[bcrypt]", "python-multipart", "pymongo", "motor", "redis", 
                 "psycopg2-binary", "sqlalchemy", "asyncpg", "newsapi-python")
    .apt_install("postgresql-client")
)

# Define secrets
secrets = [
    Secret.from_name("newsroom-db-credentials"),
    Secret.from_name("newsroom-api-keys"),
    Secret.from_name("newsroom-jwt-secret")
]

# Define environment-specific configurations
ENVIRONMENTS = {
    "dev": {
        "mongodb_uri": "mongodb://localhost:27017/newsroom",
        "postgres_uri": "postgresql://postgres:postgres@localhost:5432/newsroom",
        "redis_uri": "redis://localhost:6379/0",
        "cors_origins": ["http://localhost:3000"],
    },
    "staging": {
        "mongodb_uri": "mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.mongodb.net/newsroom-staging",
        "postgres_uri": "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres.example.com:5432/newsroom-staging",
        "redis_uri": "redis://${REDIS_USER}:${REDIS_PASSWORD}@redis.example.com:6379/0",
        "cors_origins": ["https://staging.newsroom.example.com"],
    },
    "production": {
        "mongodb_uri": "mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.mongodb.net/newsroom-production",
        "postgres_uri": "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres.example.com:5432/newsroom-production",
        "redis_uri": "redis://${REDIS_USER}:${REDIS_PASSWORD}@redis.example.com:6379/0",
        "cors_origins": ["https://newsroom.example.com"],
    },
}

# Define the main API function
@stub.function(
    image=image,
    secrets=secrets,
    keep_warm=1,
    timeout=60,
    memory=1024,
    cpu=1.0,
    concurrency_limit=10,
)
@web_endpoint(method="GET", path="/")
def root():
    return {"message": "Welcome to the News Room API"}

# Define the health check endpoint
@stub.function(
    image=image,
    secrets=secrets,
    keep_warm=1,
    timeout=10,
    memory=256,
)
@web_endpoint(method="GET", path="/health")
def health_check():
    return {"status": "healthy"}

# Define the main API application
@stub.function(
    image=image,
    secrets=secrets,
    keep_warm=2,
    timeout=60,
    memory=1024,
    cpu=1.0,
    concurrency_limit=20,
)
@web_endpoint()
def app():
    # This function will be imported from your backend code
    # and will return the FastAPI application
    from backend.app import create_app
    return create_app()

