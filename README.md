# News Room Web Application

A modern news aggregation platform with tiered access (free, individual paid, organization) focusing on geopolitics, economy, and technology with a futuristic, elegant aesthetic.

## Project Structure

The project is divided into two main components:

### Frontend

- **Framework**: React with Next.js for server-side rendering and optimized performance
- **UI Library**: Tailwind CSS with a custom design system
- **State Management**: Redux or Context API
- **Authentication**: JWT with refresh tokens
- **Deployment**: Vercel

### Backend

- **API**: Python with FastAPI
- **News Source**: [NewsAPI.org](https://newsapi.org/)
- **Serverless Functions**: Modal for scalable, containerized backend
- **Database Structure**:
  - PostgreSQL for relational data
  - MongoDB for content and analytics
  - Redis for caching and session management

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn api.main:app --reload
```

## Features

- Personalized news feed based on user interests
- Global news coverage with emphasis on geopolitics, economy, and technology
- Multi-tier subscription model
- Organization-level features for team collaboration
- User history tracking and content recommendations

## Subscription Model

### Free Tier
- Limited articles per day (5-10)
- Basic personalization
- Ad-supported experience
- Standard news updates

### Individual Paid Tier
- Unlimited articles
- Advanced personalization
- Ad-free experience
- Premium content access
- Early access to features
- Offline reading
- Newsletter subscriptions
- Price: $9.99/month or $99/year

### Organization Tier
- All individual features
- Team sharing capabilities
- Collaborative workspaces
- Custom dashboards
- API access
- Usage analytics
- Dedicated support

