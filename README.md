# News Room Web App

A news aggregation platform focusing on geopolitics, economy, and technology with tiered access levels and a futuristic design aesthetic.

## Project Overview

### Core Features

* Basic news feed with focus categories
* Simple user authentication and preferences
* Tiered access simulation (free/paid/organization)
* Local data storage

## Technical Architecture

### Frontend

* **Framework**: React with Next.js
* **UI Library**: Tailwind CSS
* **State Management**: React Context API
* **Authentication**: JWT tokens stored in local storage
* **Local Development**: Next.js dev server (`npm run dev`)

### Backend

* **API**: Python with FastAPI
* **Local Development**: Uvicorn server
* **Database**: SQLite for local development
* **Mock Services**: JSON files for initial content

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```
   uvicorn main:app --reload
   ```

5. The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. The application will be available at http://localhost:3000

## Database Schema

The application uses the following database schema:

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

## Project Structure

```
newsroom-demo/
├── backend/
│   ├── data/           # Sample data files
│   ├── models/         # Pydantic models for API
│   ├── routers/        # API route handlers
│   ├── utils/          # Utility functions
│   ├── main.py         # FastAPI application entry point
│   └── requirements.txt # Python dependencies
├── database/
│   ├── db.py           # Database connection setup
│   └── schema.py       # SQLAlchemy models
└── frontend/
    ├── app/            # Next.js app directory
    ├── components/     # React components
    ├── lib/            # Utility functions and hooks
    └── public/         # Static assets
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

