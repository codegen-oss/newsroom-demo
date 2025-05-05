# Database Infrastructure for News Room

This directory contains configuration files and setup scripts for the News Room application's database infrastructure.

## Database Architecture

The News Room application uses a multi-database approach:

1. **PostgreSQL**: For relational data (users, subscriptions, organizations)
2. **MongoDB**: For content storage and analytics
3. **Redis**: For caching and session management

## PostgreSQL Setup

PostgreSQL is used for storing structured data that requires relational integrity:

- User accounts and profiles
- Subscription information
- Organization data
- User preferences
- API keys

### Setup Instructions

1. Install PostgreSQL
2. Run the setup script:
   ```
   psql -U postgres -f postgres_setup.sql
   ```

### Connection String Format

```
postgresql://username:password@hostname:5432/newsroom
```

## MongoDB Setup

MongoDB is used for storing:

- News articles
- User activity and reading history
- Analytics data
- Notifications

### Setup Instructions

1. Install MongoDB
2. Run the setup script:
   ```
   mongo < mongodb_setup.js
   ```

### Connection String Format

```
mongodb://username:password@hostname:27017/newsroom
```

## Redis Setup

Redis is used for:

- Caching frequently accessed data
- Session management
- Rate limiting
- Real-time features

### Setup Instructions

1. Install Redis
2. Use the provided configuration file:
   ```
   redis-server redis_setup.conf
   ```

### Connection String Format

```
redis://username:password@hostname:6379/0
```

## Backup Strategy

### PostgreSQL

Daily backups using `pg_dump`:

```bash
pg_dump -U postgres newsroom > newsroom_$(date +%Y%m%d).sql
```

### MongoDB

Daily backups using `mongodump`:

```bash
mongodump --db newsroom --out /backup/mongodb/$(date +%Y%m%d)
```

### Redis

Redis persistence is configured with both RDB snapshots and AOF logs.

## Scaling Considerations

- PostgreSQL: Consider read replicas for scaling read operations
- MongoDB: Use sharding for horizontal scaling
- Redis: Consider Redis Cluster for distributed caching

## Security Best Practices

- Use strong, unique passwords for database accounts
- Enable TLS/SSL for all database connections
- Implement network-level security (firewalls, VPCs)
- Regularly audit database access
- Use least privilege principle for database users

