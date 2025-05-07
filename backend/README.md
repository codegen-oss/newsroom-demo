# News Room Backend API

This is the backend API for the News Room Web Application. It provides endpoints for user authentication, article management, user preferences, and organization management.

## Features

- User authentication with JWT tokens
- User registration and profile management
- Article creation, retrieval, update, and deletion
- User interests management
- Organization management with member roles
- Comprehensive test coverage

## Technical Stack

- **Framework**: FastAPI
- **Database**: SQLAlchemy with SQLite (for development)
- **Authentication**: JWT tokens
- **Validation**: Pydantic
- **Testing**: Pytest

## Getting Started

### Prerequisites

- Python 3.8+
- Virtual environment (recommended)

### Installation

1. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

### Running the API

```bash
cd backend
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000.

- API Documentation: http://localhost:8000/docs
- ReDoc Documentation: http://localhost:8000/redoc

### Running Tests

```bash
cd backend
pytest
```

## API Endpoints

### Authentication

- `POST /token` - Get access token (login)
- `POST /register` - Register a new user

### Users

- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `GET /users/interests` - Get user interests
- `POST /users/interests` - Create user interests
- `PUT /users/interests` - Update user interests
- `DELETE /users/interests` - Delete user interests

### Articles

- `GET /articles/` - Get articles (with filtering and pagination)
- `GET /articles/{article_id}` - Get article by ID
- `POST /articles/` - Create a new article
- `PUT /articles/{article_id}` - Update an article
- `DELETE /articles/{article_id}` - Delete an article

### Organizations

- `GET /organizations/` - Get user's organizations
- `GET /organizations/{org_id}` - Get organization by ID
- `POST /organizations/` - Create a new organization
- `PUT /organizations/{org_id}` - Update an organization
- `DELETE /organizations/{org_id}` - Delete an organization
- `GET /organizations/{org_id}/members` - Get organization members
- `POST /organizations/{org_id}/members` - Add a member to organization
- `PUT /organizations/{org_id}/members/{user_id}` - Update member role
- `DELETE /organizations/{org_id}/members/{user_id}` - Remove member from organization

## Database Schema

### Users Table

```
User {
  id: UUID,
  email: String,
  passwordHash: String,
  displayName: String,
  subscriptionTier: Enum['free', 'individual', 'organization'],
  createdAt: DateTime,
  preferences: JSON
}
```

### UserInterests Table

```
UserInterest {
  id: UUID,
  userId: UUID,
  categories: JSON,
  regions: JSON,
  topics: JSON
}
```

### Articles Table

```
Article {
  id: UUID,
  title: String,
  content: String,
  summary: String,
  source: String,
  sourceUrl: String,
  author: String,
  publishedAt: DateTime,
  categories: JSON,
  accessTier: Enum['free', 'premium', 'organization'],
  featuredImage: String
}
```

### Organizations Table

```
Organization {
  id: UUID,
  name: String,
  subscription: JSON,
  createdAt: DateTime
}
```

### OrganizationMembers Table

```
OrganizationMember {
  id: UUID,
  organizationId: UUID,
  userId: UUID,
  role: Enum['admin', 'member']
}
```

