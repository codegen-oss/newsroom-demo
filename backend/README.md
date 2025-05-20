# News Room Backend

This is the backend for the News Room web application, built with FastAPI and SQLAlchemy.

## Features

- User authentication with JWT
- Article management with access control
- User profile and preferences management
- Organization management
- RESTful API design

## Getting Started

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### Running the Application

1. Initialize the database:
   ```
   python -m app.db.init
   ```
2. Start the server:
   ```
   uvicorn app.main:app --reload
   ```
3. The API will be available at http://localhost:8000
4. API documentation is available at http://localhost:8000/docs

## API Endpoints

### Authentication
- POST `/api/v1/auth/register` - Register a new user
- POST `/api/v1/auth/login` - Login and get access token
- GET `/api/v1/auth/me` - Get current user info

### Users
- GET `/api/v1/users/` - List users
- GET `/api/v1/users/{user_id}` - Get user by ID
- PUT `/api/v1/users/me` - Update current user
- GET `/api/v1/users/me/interests` - Get current user's interests
- POST `/api/v1/users/me/interests` - Create interests for current user
- PUT `/api/v1/users/me/interests` - Update current user's interests

### Articles
- GET `/api/v1/articles/` - List articles with filtering and pagination
- POST `/api/v1/articles/` - Create a new article
- GET `/api/v1/articles/{article_id}` - Get article by ID
- PUT `/api/v1/articles/{article_id}` - Update an article
- DELETE `/api/v1/articles/{article_id}` - Delete an article

### Organizations
- GET `/api/v1/organizations/` - List organizations
- POST `/api/v1/organizations/` - Create a new organization
- GET `/api/v1/organizations/{organization_id}` - Get organization by ID
- PUT `/api/v1/organizations/{organization_id}` - Update an organization
- GET `/api/v1/organizations/{organization_id}/members` - List organization members
- POST `/api/v1/organizations/{organization_id}/members` - Add a member to an organization
- PUT `/api/v1/organizations/{organization_id}/members/{member_id}` - Update a member's role
- DELETE `/api/v1/organizations/{organization_id}/members/{user_id}` - Remove a member from an organization

