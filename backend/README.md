# News Room Backend

This is the backend implementation for the News Room Web App, built with FastAPI and Modal for serverless functions.

## Architecture

The backend is structured as follows:

- **API Layer**: FastAPI application with routers for different endpoints
- **Serverless Functions**: Modal for hosting the API and running background jobs
- **Database Layer**: MongoDB, PostgreSQL, and Redis for different data needs

## Components

### API Endpoints

The API is organized into the following routers:

- **Auth**: Authentication endpoints for user registration, login, token refresh, etc.
- **Users**: User management endpoints for profile, interests, and history
- **Articles**: Article endpoints for fetching, filtering, and interacting with articles
- **Organizations**: Organization management endpoints for teams and members
- **Subscriptions**: Subscription management endpoints for plans and billing

### Database Integration

- **MongoDB**: Used for content and analytics data (articles, user history, etc.)
- **PostgreSQL**: Used for relational data (not fully implemented in this version)
- **Redis**: Used for caching and session management (refresh tokens, etc.)

### Modal Serverless Functions

- **API Handler**: Forwards requests to the FastAPI application
- **News Fetcher**: Background job that runs every 6 hours to fetch news articles
- **Popularity Updater**: Background job that runs daily to update article popularity scores

### Authentication & Authorization

- **JWT Authentication**: Secure token-based authentication
- **Refresh Tokens**: Stored in Redis for secure session management
- **Role-Based Access Control**: Different permissions based on user roles
- **Subscription Tier Access Control**: Content access based on subscription tier

## Getting Started

### Prerequisites

- Python 3.8+
- Docker and Docker Compose (for local development)
- Modal CLI (for deployment)

### Local Development

1. Start the database services:

```bash
docker-compose up -d
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the FastAPI application:

```bash
python app.py
```

The API will be available at http://localhost:8000.

### Deployment with Modal

1. Install Modal CLI:

```bash
pip install modal
```

2. Set up Modal secrets:

```bash
modal secret create mongo-url "your-mongodb-url"
modal secret create postgres-url "your-postgres-url"
modal secret create redis-url "your-redis-url"
modal secret create jwt-secret "your-jwt-secret"
modal secret create news-api-key "your-news-api-key"
```

3. Deploy the application:

```bash
modal deploy app.py
```

## API Documentation

When running locally, API documentation is available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Data Models

The main data models are:

- **User**: User account information and preferences
- **Article**: News article content and metadata
- **Organization**: Team information and subscription details
- **UserHistory**: User reading history and interactions

## Background Jobs

- **News Fetching**: Runs every 6 hours to fetch and process news articles
- **Popularity Updates**: Runs daily to update article popularity scores and trending topics

