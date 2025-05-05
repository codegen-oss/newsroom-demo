# News Room Infrastructure Setup

This document provides detailed information about the infrastructure setup for the News Room application.

## Infrastructure Architecture

The News Room application uses a modern, cloud-native architecture:

```
                                  +----------------+
                                  |                |
                                  |  DNS Provider  |
                                  |                |
                                  +--------+-------+
                                           |
                                           v
+----------------+              +----------+---------+
|                |              |                    |
|  GitHub        +------------->+  GitHub Actions    |
|  Repository    |              |  CI/CD             |
|                |              |                    |
+----------------+              +----------+---------+
                                           |
                                           v
+----------------+              +----------+---------+              +----------------+
|                |              |                    |              |                |
|  Vercel        +<-------------+  Frontend          +------------->+  Modal         |
|  (Frontend)    |              |  (Next.js)         |              |  (Backend)     |
|                |              |                    |              |                |
+----------------+              +----------+---------+              +-------+--------+
                                           |                                |
                                           v                                v
                                +----------+---------+              +-------+--------+
                                |                    |              |                |
                                |  CDN               |              |  API Gateway   |
                                |                    |              |                |
                                +----------+---------+              +-------+--------+
                                           |                                |
                                           v                                v
                                +----------+---------+              +-------+--------+
                                |                    |              |                |
                                |  End Users         |              |  Databases     |
                                |                    |              |                |
                                +--------------------+              +----------------+
                                                                    |                |
                                                                    |  PostgreSQL    |
                                                                    |  MongoDB       |
                                                                    |  Redis         |
                                                                    |                |
                                                                    +-------+--------+
                                                                            |
                                                                            v
                                                                    +-------+--------+
                                                                    |                |
                                                                    |  Monitoring    |
                                                                    |  Prometheus    |
                                                                    |  Grafana       |
                                                                    |                |
                                                                    +----------------+
```

## Infrastructure Components

### Frontend (Vercel)

Vercel provides a global CDN and edge network for the frontend application:

- **Framework**: Next.js
- **Deployment**: Continuous deployment via GitHub integration
- **Scaling**: Automatic scaling based on traffic
- **Edge Network**: Global CDN with edge caching
- **Custom Domain**: HTTPS with automatic certificate management

### Backend (Modal)

Modal provides serverless Python execution for the backend API:

- **Framework**: FastAPI
- **Deployment**: Containerized deployment via Modal CLI
- **Scaling**: Automatic scaling based on demand
- **Cold Start**: Minimal cold start times with warm instances
- **Secrets Management**: Secure storage for API keys and credentials

### Databases

The application uses multiple databases for different purposes:

#### PostgreSQL

- **Usage**: Relational data (users, subscriptions, organizations)
- **Hosting Options**:
  - AWS RDS
  - DigitalOcean Managed Databases
  - Heroku Postgres
- **Scaling**: Vertical scaling with read replicas
- **Backup**: Daily automated backups

#### MongoDB

- **Usage**: Content storage and analytics
- **Hosting Options**:
  - MongoDB Atlas
  - AWS DocumentDB
  - Self-hosted MongoDB
- **Scaling**: Horizontal scaling with sharding
- **Backup**: Daily automated backups

#### Redis

- **Usage**: Caching and session management
- **Hosting Options**:
  - Redis Labs
  - AWS ElastiCache
  - Self-hosted Redis
- **Scaling**: Cluster mode for horizontal scaling
- **Persistence**: RDB snapshots and AOF logs

### Monitoring and Logging

- **Metrics Collection**: Prometheus
- **Visualization**: Grafana
- **Log Aggregation**: ELK Stack or managed service
- **Alerting**: Prometheus Alertmanager with Slack/PagerDuty integration

## Infrastructure Provisioning

### Manual Setup

Follow these steps for manual infrastructure setup:

1. **Vercel Setup**:
   - Create a Vercel account
   - Connect your GitHub repository
   - Configure build settings for the frontend directory
   - Set up environment variables
   - Configure custom domain

2. **Modal Setup**:
   - Create a Modal account
   - Install the Modal CLI
   - Create secrets for database credentials and API keys
   - Deploy the backend application

3. **Database Setup**:
   - Create PostgreSQL, MongoDB, and Redis instances
   - Run the setup scripts to create schemas and indexes
   - Configure connection strings in environment variables

4. **Monitoring Setup**:
   - Set up Prometheus and Grafana
   - Configure exporters for each service
   - Import the provided dashboards
   - Set up alerting rules

### Infrastructure as Code (Optional)

For a more automated approach, consider using:

- **Terraform**: For provisioning cloud resources
- **Docker Compose**: For local development environment
- **Kubernetes**: For self-hosted deployment

Example Terraform configuration for AWS resources:

```hcl
provider "aws" {
  region = "us-east-1"
}

# RDS PostgreSQL instance
resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "13.4"
  instance_class       = "db.t3.micro"
  name                 = "newsroom"
  username             = "newsroom_user"
  password             = var.db_password
  parameter_group_name = "default.postgres13"
  skip_final_snapshot  = true
  publicly_accessible  = false
  vpc_security_group_ids = [aws_security_group.postgres_sg.id]
  db_subnet_group_name = aws_db_subnet_group.default.name
}

# ElastiCache Redis instance
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "newsroom-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis6.x"
  engine_version       = "6.x"
  port                 = 6379
  security_group_ids   = [aws_security_group.redis_sg.id]
  subnet_group_name    = aws_elasticache_subnet_group.default.name
}
```

## Network Architecture

### Public Endpoints

- Frontend: `https://newsroom.example.com`
- Backend API: `https://newsroom-api.modal.run`
- Monitoring: `https://monitoring.newsroom.example.com` (internal access only)

### Security Groups and Firewalls

- Frontend: Allow HTTP/HTTPS (ports 80/443)
- Backend: Allow HTTPS (port 443)
- Databases: Allow specific ports from backend only
- Monitoring: Allow internal access only

### VPC and Subnets

If using AWS or similar cloud provider:

- VPC with public and private subnets
- Public subnets for load balancers
- Private subnets for databases
- NAT gateway for outbound traffic from private subnets

## Scaling Considerations

### Frontend Scaling

- Vercel automatically scales based on traffic
- Edge caching for static assets
- CDN for global distribution

### Backend Scaling

- Modal automatically scales based on request volume
- Configure concurrency limits based on expected load
- Set appropriate memory and CPU allocations

### Database Scaling

- PostgreSQL: Vertical scaling with read replicas
- MongoDB: Horizontal scaling with sharding
- Redis: Cluster mode for distributed caching

## Disaster Recovery

### Backup Strategy

- PostgreSQL: Daily automated backups with point-in-time recovery
- MongoDB: Daily automated backups with oplog-based recovery
- Redis: RDB snapshots and AOF logs

### Recovery Procedures

1. **Frontend**: Revert to previous deployment in Vercel
2. **Backend**: Revert to previous version in Modal
3. **Databases**: Restore from the most recent backup

### High Availability

- Use multiple availability zones for all components
- Configure automatic failover for databases
- Implement health checks and auto-healing

## Cost Optimization

- Use serverless platforms (Vercel, Modal) to pay only for what you use
- Scale database resources based on actual usage
- Implement caching to reduce database load
- Use spot instances for non-critical components
- Monitor and optimize resource usage regularly

