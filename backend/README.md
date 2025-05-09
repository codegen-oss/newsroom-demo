# News Room Web App - Backend

This directory contains the backend implementation for the News Room Web App.

## Database Schema Implementation

The database schema implementation includes:

### MongoDB Schemas

- **Users Collection**: User authentication and profile data
- **UserInterests Collection**: User preferences for content
- **UserHistory Collection**: User interaction history with articles
- **Articles Collection**: News article content and metadata
- **Organizations Collection**: Organization details and subscription information
- **OrganizationMembers Collection**: Organization membership data

### PostgreSQL Schemas

- **Users Table**: User account information
- **Subscriptions Tables**: Subscription plans, user subscriptions, payment methods, and billing transactions
- **Organization Tables**: Organization details, subscriptions, members, and invitations

### Redis Cache Configuration

- **Session Storage**: User session management
- **Article View Caching**: Caching for frequently accessed articles
- **User Preferences Caching**: Caching for user preferences
- **Rate Limiting Configuration**: API rate limiting settings

### Data Migration Scripts

- **Initial Data Seeding**: Scripts to populate initial data
- **Schema Migration Utilities**: Tools for database schema migrations
- **Backup and Restore Procedures**: Database backup and recovery tools

### Data Access Layer

- **Repository Pattern Implementations**: Data access abstraction
- **Data Access Services**: Service layer for data operations
- **Query Optimization Utilities**: Performance optimization tools
- **Connection Pooling Configuration**: Database connection management

## Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── mongodb/
│   │   ├── postgresql/
│   │   ├── redis/
│   │   └── connection-pool.config.js
│   ├── models/
│   │   ├── mongodb/
│   │   └── postgresql/
│   ├── schemas/
│   │   ├── mongodb/
│   │   └── postgresql/
│   ├── services/
│   │   ├── data_access/
│   │   └── migration/
│   └── utils/
├── migrations/
│   ├── mongodb/
│   └── postgresql/
└── seeds/
    ├── mongodb/
    └── postgresql/
```

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   ```
   cp .env.example .env
   ```

3. Run database migrations:
   ```
   npm run migrate
   ```

4. Seed initial data:
   ```
   npm run seed
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Database Configuration

### MongoDB

MongoDB is used for content and analytics data, including:
- Articles and content
- User interactions and history
- Analytics data

### PostgreSQL

PostgreSQL is used for relational data, including:
- User accounts
- Subscriptions and billing
- Organization structure and relationships

### Redis

Redis is used for caching and session management, including:
- User sessions
- Frequently accessed content
- Rate limiting
- User preferences

