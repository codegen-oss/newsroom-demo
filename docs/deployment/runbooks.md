# News Room Operational Runbooks

This document provides runbooks for common operations and troubleshooting procedures for the News Room application.

## Table of Contents

1. [Deployment Procedures](#deployment-procedures)
2. [Database Operations](#database-operations)
3. [Monitoring and Alerting](#monitoring-and-alerting)
4. [Incident Response](#incident-response)
5. [Backup and Restore](#backup-and-restore)
6. [Performance Tuning](#performance-tuning)
7. [Security Operations](#security-operations)

## Deployment Procedures

### Frontend Deployment

#### Standard Deployment

1. Push changes to the main branch
2. GitHub Actions will automatically deploy to Vercel
3. Verify deployment in the Vercel dashboard
4. Check the application at `https://newsroom.example.com`

#### Manual Deployment

```bash
# From the frontend directory
npm run build
vercel --prod
```

#### Rollback Procedure

1. Go to the Vercel dashboard
2. Select the News Room project
3. Go to "Deployments"
4. Find the previous working deployment
5. Click "..." and select "Promote to Production"

### Backend Deployment

#### Standard Deployment

1. Push changes to the main branch
2. GitHub Actions will automatically deploy to Modal
3. Verify deployment in the Modal dashboard
4. Check the API at `https://newsroom-api.modal.run/health`

#### Manual Deployment

```bash
# From the backend directory
modal deploy app.py
```

#### Rollback Procedure

1. Go to the Modal dashboard
2. Find the previous working version
3. Click "Redeploy"

## Database Operations

### PostgreSQL

#### Connection

```bash
psql -U username -h hostname -d newsroom
```

#### Backup

```bash
pg_dump -U username -h hostname -d newsroom > newsroom_$(date +%Y%m%d).sql
```

#### Restore

```bash
psql -U username -h hostname -d newsroom < backup_file.sql
```

#### Common Queries

```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Kill a specific connection
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid = <pid>;

-- Check table sizes
SELECT table_name, pg_size_pretty(pg_total_relation_size(table_name::text)) AS size
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY pg_total_relation_size(table_name::text) DESC;
```

### MongoDB

#### Connection

```bash
mongo mongodb://username:password@hostname:27017/newsroom
```

#### Backup

```bash
mongodump --uri mongodb://username:password@hostname:27017/newsroom --out /backup/mongodb/$(date +%Y%m%d)
```

#### Restore

```bash
mongorestore --uri mongodb://username:password@hostname:27017/newsroom /backup/mongodb/20230101
```

#### Common Commands

```javascript
// Check database stats
db.stats();

// Check collection stats
db.articles.stats();

// Find slow queries
db.currentOp(
  {
    "active" : true,
    "secs_running" : { "$gt" : 5 }
  }
);
```

### Redis

#### Connection

```bash
redis-cli -h hostname -p 6379 -a password
```

#### Backup

Redis persistence is configured with both RDB snapshots and AOF logs.

#### Common Commands

```bash
# Check memory usage
INFO memory

# Clear cache
FLUSHDB

# Monitor commands
MONITOR

# Check key expiration
TTL key_name
```

## Monitoring and Alerting

### Accessing Monitoring

- Prometheus: `https://monitoring.newsroom.example.com/prometheus`
- Grafana: `https://monitoring.newsroom.example.com/grafana`

### Common Prometheus Queries

```
# CPU usage
100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100

# Disk usage
(node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes * 100

# HTTP request rate
rate(http_requests_total[5m])

# HTTP error rate
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100
```

### Alert Management

1. Access Alertmanager at `https://monitoring.newsroom.example.com/alertmanager`
2. View active alerts
3. Silence or resolve alerts as needed

## Incident Response

### High CPU Usage

1. Check Grafana dashboard for CPU usage trends
2. Identify the process causing high CPU:
   ```bash
   top -c
   ```
3. If it's a database query, identify and optimize the query
4. If it's the application, check for infinite loops or inefficient code
5. Consider scaling up the instance if needed

### High Memory Usage

1. Check Grafana dashboard for memory usage trends
2. Identify the process causing high memory usage:
   ```bash
   ps aux --sort=-%mem | head
   ```
3. Check for memory leaks in the application
4. Consider increasing swap space temporarily
5. Restart the service if necessary

### Database Connection Issues

1. Check if the database is running:
   ```bash
   pg_isready -h hostname
   ```
2. Check for connection limits:
   ```sql
   SELECT count(*) FROM pg_stat_activity;
   ```
3. Check for network issues:
   ```bash
   ping hostname
   telnet hostname 5432
   ```
4. Restart the database service if necessary

### API Errors

1. Check the API logs:
   ```bash
   modal logs newsroom-api
   ```
2. Verify database connectivity
3. Check for recent code changes
4. Roll back to a previous version if necessary

## Backup and Restore

### Automated Backup Schedule

- PostgreSQL: Daily at 1:00 AM UTC
- MongoDB: Daily at 2:00 AM UTC
- Redis: Continuous with RDB snapshots every hour

### Manual Backup Procedure

```bash
# PostgreSQL
pg_dump -U username -h hostname -d newsroom > /backup/postgres/newsroom_manual_$(date +%Y%m%d).sql

# MongoDB
mongodump --uri mongodb://username:password@hostname:27017/newsroom --out /backup/mongodb/manual_$(date +%Y%m%d)

# Redis
redis-cli -h hostname -p 6379 -a password SAVE
```

### Restore Procedure

1. Stop the application services
2. Restore the database:
   ```bash
   # PostgreSQL
   psql -U username -h hostname -d newsroom < /backup/postgres/newsroom_20230101.sql
   
   # MongoDB
   mongorestore --uri mongodb://username:password@hostname:27017/newsroom /backup/mongodb/20230101
   
   # Redis
   # Copy the RDB file to the Redis data directory and restart Redis
   ```
3. Start the application services
4. Verify the application is working correctly

## Performance Tuning

### Frontend Performance

1. Check Lighthouse scores:
   ```bash
   npx lighthouse https://newsroom.example.com
   ```
2. Optimize image sizes and formats
3. Implement code splitting
4. Enable caching headers
5. Use CDN for static assets

### Backend Performance

1. Profile API endpoints:
   ```bash
   ab -n 1000 -c 10 https://newsroom-api.modal.run/api/articles
   ```
2. Optimize database queries
3. Implement caching for frequently accessed data
4. Use pagination for large result sets
5. Consider asynchronous processing for heavy tasks

### Database Performance

#### PostgreSQL

```sql
-- Identify slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Add indexes for frequently queried columns
CREATE INDEX idx_column_name ON table_name(column_name);

-- Vacuum the database
VACUUM ANALYZE;
```

#### MongoDB

```javascript
// Identify slow queries
db.currentOp(
  {
    "active" : true,
    "secs_running" : { "$gt" : 1 }
  }
);

// Add indexes for frequently queried fields
db.collection.createIndex({ field_name: 1 });

// Analyze query performance
db.collection.find({ field_name: "value" }).explain("executionStats");
```

## Security Operations

### SSL Certificate Renewal

Let's Encrypt certificates are automatically renewed by Certbot. To manually renew:

```bash
certbot renew --force-renewal
```

### Security Scanning

1. Run vulnerability scanning:
   ```bash
   npm audit
   pip-audit
   ```
2. Run OWASP ZAP scan:
   ```bash
   zap-cli quick-scan --self-contained --start-options '-config api.disablekey=true' https://newsroom.example.com
   ```
3. Address any identified vulnerabilities

### User Management

#### Add Admin User

```sql
-- PostgreSQL
INSERT INTO users (email, password_hash, full_name, subscription_tier, is_active)
VALUES ('admin@example.com', '$2b$12$...', 'Admin User', 'organization', true);
```

#### Reset User Password

```sql
-- PostgreSQL
UPDATE users SET password_hash = '$2b$12$...' WHERE email = 'user@example.com';
```

### API Key Management

#### Generate New API Key

```bash
# Using the API
curl -X POST https://newsroom-api.modal.run/api/keys \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "New API Key", "expires_in_days": 365}'
```

#### Revoke API Key

```bash
# Using the API
curl -X DELETE https://newsroom-api.modal.run/api/keys/{key_id} \
  -H "Authorization: Bearer $JWT_TOKEN"
```

