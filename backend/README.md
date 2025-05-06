# News Room Backend

This is the backend API for the News Room application, built with FastAPI and SQLAlchemy.

## Features

- User authentication and authorization
- Organization management with role-based access control
- Article management
- RESTful API design

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Initialize the database with mock data:
   ```
   python -m app.init_db
   ```

4. Run the application:
   ```
   uvicorn app.main:app --reload
   ```

5. Access the API documentation:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Organizations

- `POST /api/organizations` - Create a new organization
- `GET /api/organizations` - Get organizations for current user
- `GET /api/organizations/{organization_id}` - Get a specific organization
- `PUT /api/organizations/{organization_id}` - Update an organization
- `DELETE /api/organizations/{organization_id}` - Delete an organization

### Organization Members

- `POST /api/organizations/{organization_id}/members` - Add a member to an organization
- `GET /api/organizations/{organization_id}/members` - Get all members of an organization
- `PUT /api/organizations/{organization_id}/members/{member_id}` - Update a member's role
- `DELETE /api/organizations/{organization_id}/members/{member_id}` - Remove a member

## Organization Roles

- **Owner**: Full control over the organization, can manage members and settings
- **Admin**: Can manage content and members, but cannot delete the organization
- **Editor**: Can create and edit content
- **Member**: Can view content

## Subscription Tiers

- **Free**: Basic access
- **Basic**: Standard features
- **Premium**: Advanced features
- **Enterprise**: Custom solutions and support

