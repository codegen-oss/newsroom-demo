# News Room Web App

A news aggregation platform focusing on geopolitics, economy, and technology with tiered access levels and a futuristic design aesthetic.

## Project Structure

This project consists of two main components:

- **Frontend**: A Next.js application with Tailwind CSS for styling
- **Backend**: A FastAPI application with SQLite database

## Core Features

- Basic news feed with focus categories
- Simple user authentication and preferences
- Tiered access simulation (free/paid/organization)
- Local data storage

## Getting Started

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload
```

The backend API will be available at http://localhost:8000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend application will be available at http://localhost:3000

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

## Technical Architecture

### Frontend

- **Framework**: React with Next.js
- **UI Library**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: JWT tokens stored in local storage
- **Local Development**: Next.js dev server (`npm run dev`)

### Backend

- **API**: Python with FastAPI
- **Local Development**: Uvicorn server
- **Database**: SQLite for local development
- **Mock Services**: JSON files for initial content

