# API Reference

This document provides a reference for the News Room API endpoints.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:8000
```

## Authentication

(Future implementation)

Authentication will be implemented using JWT tokens:

```
Authorization: Bearer <token>
```

## Error Handling

The API returns standard HTTP status codes:

- `200 OK`: The request was successful
- `201 Created`: A resource was successfully created
- `204 No Content`: The request was successful but returns no content
- `400 Bad Request`: The request was invalid
- `401 Unauthorized`: Authentication is required
- `403 Forbidden`: The client does not have permission
- `404 Not Found`: The requested resource was not found
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

Error responses include a JSON object with details:

```json
{
  "detail": "Error message"
}
```

## Articles

### Get All Articles

```
GET /articles
```

Query parameters:

- `skip` (integer, default: 0): Number of articles to skip
- `limit` (integer, default: 100): Maximum number of articles to return

Response:

```json
[
  {
    "id": 1,
    "title": "Article Title",
    "content": "Article content...",
    "summary": "Article summary...",
    "author": "Author Name",
    "published_date": "2023-01-01T00:00:00Z",
    "updated_date": "2023-01-01T00:00:00Z",
    "categories": [
      {
        "id": 1,
        "name": "Category Name",
        "description": "Category description..."
      }
    ]
  }
]
```

### Get Article by ID

```
GET /articles/{article_id}
```

Path parameters:

- `article_id` (integer, required): ID of the article to retrieve

Response:

```json
{
  "id": 1,
  "title": "Article Title",
  "content": "Article content...",
  "summary": "Article summary...",
  "author": "Author Name",
  "published_date": "2023-01-01T00:00:00Z",
  "updated_date": "2023-01-01T00:00:00Z",
  "categories": [
    {
      "id": 1,
      "name": "Category Name",
      "description": "Category description..."
    }
  ]
}
```

### Create Article

```
POST /articles
```

Request body:

```json
{
  "title": "New Article Title",
  "content": "Article content...",
  "summary": "Article summary...",
  "author": "Author Name",
  "category_ids": [1, 2]
}
```

Response:

```json
{
  "id": 1,
  "title": "New Article Title",
  "content": "Article content...",
  "summary": "Article summary...",
  "author": "Author Name",
  "published_date": "2023-01-01T00:00:00Z",
  "updated_date": "2023-01-01T00:00:00Z",
  "categories": [
    {
      "id": 1,
      "name": "Category Name",
      "description": "Category description..."
    }
  ]
}
```

### Update Article

```
PUT /articles/{article_id}
```

Path parameters:

- `article_id` (integer, required): ID of the article to update

Request body:

```json
{
  "title": "Updated Article Title",
  "content": "Updated content...",
  "summary": "Updated summary...",
  "author": "Updated Author",
  "category_ids": [1, 3]
}
```

Response:

```json
{
  "id": 1,
  "title": "Updated Article Title",
  "content": "Updated content...",
  "summary": "Updated summary...",
  "author": "Updated Author",
  "published_date": "2023-01-01T00:00:00Z",
  "updated_date": "2023-01-02T00:00:00Z",
  "categories": [
    {
      "id": 1,
      "name": "Category Name",
      "description": "Category description..."
    },
    {
      "id": 3,
      "name": "Another Category",
      "description": "Another description..."
    }
  ]
}
```

### Delete Article

```
DELETE /articles/{article_id}
```

Path parameters:

- `article_id` (integer, required): ID of the article to delete

Response:

- Status code: `204 No Content`

## Categories

### Get All Categories

```
GET /categories
```

Query parameters:

- `skip` (integer, default: 0): Number of categories to skip
- `limit` (integer, default: 100): Maximum number of categories to return

Response:

```json
[
  {
    "id": 1,
    "name": "Category Name",
    "description": "Category description..."
  }
]
```

### Get Category by ID

```
GET /categories/{category_id}
```

Path parameters:

- `category_id` (integer, required): ID of the category to retrieve

Response:

```json
{
  "id": 1,
  "name": "Category Name",
  "description": "Category description..."
}
```

### Create Category

```
POST /categories
```

Request body:

```json
{
  "name": "New Category",
  "description": "Category description..."
}
```

Response:

```json
{
  "id": 1,
  "name": "New Category",
  "description": "Category description..."
}
```

### Get Articles by Category

```
GET /categories/{category_id}/articles
```

Path parameters:

- `category_id` (integer, required): ID of the category

Query parameters:

- `skip` (integer, default: 0): Number of articles to skip
- `limit` (integer, default: 100): Maximum number of articles to return

Response:

```json
[
  {
    "id": 1,
    "title": "Article Title",
    "content": "Article content...",
    "summary": "Article summary...",
    "author": "Author Name",
    "published_date": "2023-01-01T00:00:00Z",
    "updated_date": "2023-01-01T00:00:00Z",
    "categories": [
      {
        "id": 1,
        "name": "Category Name",
        "description": "Category description..."
      }
    ]
  }
]
```

## OpenAPI Documentation

For a more detailed and interactive API documentation, run the backend server and navigate to:

```
http://localhost:8000/docs
```

This will provide a Swagger UI interface where you can:

- View all available endpoints
- See request and response schemas
- Try out API calls directly from the browser

