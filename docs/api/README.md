# News Room API Documentation

This documentation provides details about the News Room API endpoints, authentication, and data models.

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Articles](#articles)
- [Organizations](#organizations)
- [Error Handling](#error-handling)

## Authentication

The News Room API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints, you need to include the token in the Authorization header.

### Obtaining a Token

```
POST /token
```

**Request Body:**
```
username: string (email address)
password: string
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Using the Token

Include the token in the Authorization header for all protected requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Registration

```
POST /register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "display_name": "User Name",
  "subscription_tier": "free"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "display_name": "User Name",
  "subscription_tier": "free",
  "created_at": "2023-10-15T12:00:00Z"
}
```

## Users

### Get Current User

```
GET /users/me
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "display_name": "User Name",
  "subscription_tier": "free",
  "created_at": "2023-10-15T12:00:00Z",
  "preferences": {}
}
```

### Get All Users

```
GET /users/
```

**Query Parameters:**
- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum number of records to return (default: 10)

**Response:**
```json
[
  {
    "id": "uuid",
    "email": "user1@example.com",
    "display_name": "User One",
    "subscription_tier": "free",
    "created_at": "2023-10-15T12:00:00Z"
  },
  {
    "id": "uuid",
    "email": "user2@example.com",
    "display_name": "User Two",
    "subscription_tier": "premium",
    "created_at": "2023-10-16T12:00:00Z"
  }
]
```

### Get User by ID

```
GET /users/{user_id}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "display_name": "User Name",
  "subscription_tier": "free",
  "created_at": "2023-10-15T12:00:00Z",
  "preferences": {}
}
```

### Update User

```
PUT /users/{user_id}
```

**Request Body:**
```json
{
  "display_name": "Updated Name",
  "subscription_tier": "premium",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "display_name": "Updated Name",
  "subscription_tier": "premium",
  "created_at": "2023-10-15T12:00:00Z",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

### Delete User

```
DELETE /users/{user_id}
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## Articles

### Get All Articles

```
GET /articles/
```

**Query Parameters:**
- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum number of records to return (default: 10)
- `category`: Filter by category
- `access_tier`: Filter by access tier

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Article Title",
    "summary": "Article summary",
    "content": "Full article content...",
    "source": "Source Name",
    "source_url": "https://example.com/source",
    "author": "Author Name",
    "published_at": "2023-10-15T12:00:00Z",
    "categories": ["news", "politics"],
    "access_tier": "free",
    "featured_image": "https://example.com/image.jpg"
  },
  {
    "id": "uuid",
    "title": "Premium Article",
    "summary": "Premium article summary",
    "content": "Full premium article content...",
    "source": "Premium Source",
    "source_url": "https://example.com/premium-source",
    "author": "Premium Author",
    "published_at": "2023-10-16T12:00:00Z",
    "categories": ["business", "finance"],
    "access_tier": "premium",
    "featured_image": "https://example.com/premium-image.jpg"
  }
]
```

### Get Article by ID

```
GET /articles/{article_id}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Article Title",
  "summary": "Article summary",
  "content": "Full article content...",
  "source": "Source Name",
  "source_url": "https://example.com/source",
  "author": "Author Name",
  "published_at": "2023-10-15T12:00:00Z",
  "categories": ["news", "politics"],
  "access_tier": "free",
  "featured_image": "https://example.com/image.jpg"
}
```

### Create Article

```
POST /articles/
```

**Request Body:**
```json
{
  "title": "New Article",
  "summary": "New article summary",
  "content": "Full new article content...",
  "source": "Source Name",
  "source_url": "https://example.com/source",
  "author": "Author Name",
  "categories": ["news", "politics"],
  "access_tier": "free",
  "featured_image": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "New Article",
  "summary": "New article summary",
  "content": "Full new article content...",
  "source": "Source Name",
  "source_url": "https://example.com/source",
  "author": "Author Name",
  "published_at": "2023-10-17T12:00:00Z",
  "categories": ["news", "politics"],
  "access_tier": "free",
  "featured_image": "https://example.com/image.jpg"
}
```

### Update Article

```
PUT /articles/{article_id}
```

**Request Body:**
```json
{
  "title": "Updated Article",
  "summary": "Updated article summary",
  "content": "Updated article content..."
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Updated Article",
  "summary": "Updated article summary",
  "content": "Updated article content...",
  "source": "Source Name",
  "source_url": "https://example.com/source",
  "author": "Author Name",
  "published_at": "2023-10-15T12:00:00Z",
  "categories": ["news", "politics"],
  "access_tier": "free",
  "featured_image": "https://example.com/image.jpg"
}
```

### Delete Article

```
DELETE /articles/{article_id}
```

**Response:**
```json
{
  "message": "Article deleted successfully"
}
```

## Organizations

### Get All Organizations

```
GET /organizations/
```

**Query Parameters:**
- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum number of records to return (default: 10)

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Organization Name",
    "subscription": {
      "plan": "enterprise",
      "seats": 10
    },
    "created_at": "2023-10-15T12:00:00Z"
  },
  {
    "id": "uuid",
    "name": "Another Organization",
    "subscription": {
      "plan": "basic",
      "seats": 5
    },
    "created_at": "2023-10-16T12:00:00Z"
  }
]
```

### Get Organization by ID

```
GET /organizations/{organization_id}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Organization Name",
  "subscription": {
    "plan": "enterprise",
    "seats": 10
  },
  "created_at": "2023-10-15T12:00:00Z"
}
```

### Create Organization

```
POST /organizations/
```

**Request Body:**
```json
{
  "name": "New Organization",
  "subscription": {
    "plan": "basic",
    "seats": 5
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "New Organization",
  "subscription": {
    "plan": "basic",
    "seats": 5
  },
  "created_at": "2023-10-17T12:00:00Z"
}
```

### Update Organization

```
PUT /organizations/{organization_id}
```

**Request Body:**
```json
{
  "name": "Updated Organization",
  "subscription": {
    "plan": "premium",
    "seats": 20
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Updated Organization",
  "subscription": {
    "plan": "premium",
    "seats": 20
  },
  "created_at": "2023-10-15T12:00:00Z"
}
```

### Delete Organization

```
DELETE /organizations/{organization_id}
```

**Response:**
```json
{
  "message": "Organization deleted successfully"
}
```

### Get Organization Members

```
GET /organizations/{organization_id}/members
```

**Response:**
```json
[
  {
    "id": "uuid",
    "organization_id": "uuid",
    "user_id": "uuid",
    "role": "admin",
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "display_name": "Admin User"
    }
  },
  {
    "id": "uuid",
    "organization_id": "uuid",
    "user_id": "uuid",
    "role": "member",
    "user": {
      "id": "uuid",
      "email": "member@example.com",
      "display_name": "Member User"
    }
  }
]
```

### Add Organization Member

```
POST /organizations/{organization_id}/members
```

**Request Body:**
```json
{
  "user_id": "uuid",
  "role": "member"
}
```

**Response:**
```json
{
  "id": "uuid",
  "organization_id": "uuid",
  "user_id": "uuid",
  "role": "member"
}
```

### Remove Organization Member

```
DELETE /organizations/{organization_id}/members/{user_id}
```

**Response:**
```json
{
  "message": "Member removed successfully"
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests.

### Common Error Codes

- `400 Bad Request`: The request was invalid or cannot be served.
- `401 Unauthorized`: Authentication is required or has failed.
- `403 Forbidden`: The authenticated user does not have permission to access the requested resource.
- `404 Not Found`: The requested resource does not exist.
- `422 Unprocessable Entity`: The request was well-formed but was unable to be followed due to semantic errors.
- `500 Internal Server Error`: An error occurred on the server.

### Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

