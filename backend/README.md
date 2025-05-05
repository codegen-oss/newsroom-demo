# News Room Backend

This is the backend for the News Room web application, built with FastAPI, Modal, and various database technologies.

## Features

- Authentication system with JWT
- User management
- Article management
- Organization management
- Subscription management
- News API integration
- Multi-database architecture (PostgreSQL, MongoDB, Redis)
- Modal serverless deployment

## Project Structure

```
backend/
├── api/                  # FastAPI application
│   ├── routers/          # API endpoints
│   └── main.py           # FastAPI app configuration
├── auth/                 # Authentication modules
├── db/                   # Database connections
│   ├── postgres/         # PostgreSQL models and connection
│   ├── mongodb/          # MongoDB connection
│   └── redis/            # Redis connection
├── models/               # Pydantic models
├── services/             # External services
│   └── news_api/         # News API integration
├── utils/                # Utility functions
├── tests/                # Tests
├── app.py                # Modal application
└── requirements.txt      # Dependencies
```

## Setup

### Prerequisites

- Python 3.9+
- PostgreSQL
- MongoDB
- Redis

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
export POSTGRES_URL="postgresql://postgres:postgres@localhost:5432/newsroom"
export MONGODB_URL="mongodb://localhost:27017"
export REDIS_URL="redis://localhost:6379/0"
export NEWS_API_KEY="your-api-key"
export JWT_SECRET_KEY="your-secret-key"
```

4. Initialize the database:

```bash
python -m db.init_db
```

### Running Locally

```bash
uvicorn api.main:app --reload
```

### Deploying with Modal

```bash
modal deploy app.py
```

## API Documentation

When running locally, API documentation is available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

```bash
pytest
```

