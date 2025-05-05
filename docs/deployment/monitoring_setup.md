# Monitoring and Alerting Setup

This document provides detailed information about the monitoring and alerting setup for the News Room application.

## Monitoring Architecture

The News Room application uses a comprehensive monitoring stack:

```
+----------------+              +----------------+              +----------------+
|                |              |                |              |                |
|  Application   +------------->+  Prometheus    +------------->+  Grafana       |
|  Metrics       |              |  Server        |              |  Dashboards    |
|                |              |                |              |                |
+-------+--------+              +-------+--------+              +----------------+
        ^                               |
        |                               v
+-------+--------+              +-------+--------+              +----------------+
|                |              |                |              |                |
|  Exporters     |              |  Alertmanager  +------------->+  Notification  |
|  (Various)     |              |                |              |  Channels      |
|                |              |                |              |                |
+----------------+              +----------------+              +----------------+
```

## Components

### Prometheus

Prometheus is the central metrics collection system:

- **Role**: Time-series database for metrics
- **Scrape Interval**: 15 seconds
- **Retention**: 15 days
- **Configuration**: `infrastructure/monitoring/prometheus.yml`

### Grafana

Grafana provides visualization and dashboards:

- **Role**: Metrics visualization and dashboards
- **Default Dashboard**: `infrastructure/monitoring/grafana-dashboard.json`
- **Data Source**: Prometheus
- **Authentication**: Admin user with password authentication

### Alertmanager

Alertmanager handles alert routing and notifications:

- **Role**: Alert routing, grouping, and notifications
- **Notification Channels**: Slack, Email, PagerDuty
- **Alert Grouping**: By service and severity
- **Silencing**: Web UI for temporarily silencing alerts

### Exporters

Various exporters collect metrics from different services:

- **Node Exporter**: System metrics (CPU, memory, disk, network)
- **PostgreSQL Exporter**: PostgreSQL metrics
- **MongoDB Exporter**: MongoDB metrics
- **Redis Exporter**: Redis metrics
- **Blackbox Exporter**: Endpoint monitoring

## Metrics Collection

### System Metrics

- CPU usage
- Memory usage
- Disk usage and I/O
- Network traffic
- Load average

### Application Metrics

- Request rate
- Error rate
- Response time
- Active users
- Authentication attempts

### Database Metrics

- Connection count
- Query performance
- Cache hit ratio
- Transaction rate
- Replication lag

### Business Metrics

- User registrations
- Subscription conversions
- Article views
- User engagement

## Alert Rules

Alert rules are defined in `infrastructure/monitoring/alert_rules.yml`:

### Availability Alerts

- **InstanceDown**: Any monitored instance is down for more than 1 minute
- **EndpointDown**: Any monitored endpoint is down for more than 1 minute

### Database Alerts

- **PostgreSQLHighConnections**: PostgreSQL has more than 100 connections for 5 minutes
- **RedisHighMemoryUsage**: Redis is using more than 80% of its available memory for 5 minutes
- **MongoDBHighConnections**: MongoDB has more than 500 connections for 5 minutes

### System Alerts

- **HighCPULoad**: CPU load is > 80% for 5 minutes
- **HighMemoryUsage**: Memory usage is > 80% for 5 minutes
- **HighDiskUsage**: Disk usage is > 80% for 5 minutes

## Dashboard Setup

### Main Dashboard

The main dashboard (`grafana-dashboard.json`) includes:

- System metrics (CPU, memory, disk)
- Application metrics (request rate, error rate, response time)
- Database metrics (connections, query performance)
- Business metrics (user activity, subscriptions)

### Additional Dashboards

Create additional dashboards for:

- **Frontend Performance**: Page load times, client-side errors
- **Backend Performance**: API response times, error rates by endpoint
- **Database Performance**: Query performance, connection pools
- **Business Metrics**: User growth, subscription revenue, content engagement

## Logging Infrastructure

In addition to metrics, comprehensive logging is implemented:

### Log Collection

- **Application Logs**: Structured JSON logs from frontend and backend
- **System Logs**: Standard system logs
- **Database Logs**: Database server logs

### Log Storage

- **Short-term**: Local storage with rotation
- **Long-term**: Elasticsearch or cloud logging service

### Log Analysis

- **Kibana**: For searching and visualizing logs
- **Log Patterns**: Automatic detection of common patterns
- **Anomaly Detection**: Identifying unusual log patterns

## Alerting Configuration

### Notification Channels

#### Slack

```yaml
receivers:
- name: 'slack-notifications'
  slack_configs:
  - api_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
    channel: '#alerts'
    send_resolved: true
    title: '{{ template "slack.default.title" . }}'
    text: '{{ template "slack.default.text" . }}'
```

#### Email

```yaml
receivers:
- name: 'email-notifications'
  email_configs:
  - to: 'ops@newsroom.example.com'
    from: 'alertmanager@newsroom.example.com'
    smarthost: 'smtp.example.com:587'
    auth_username: 'alertmanager@newsroom.example.com'
    auth_password: 'password'
    send_resolved: true
```

#### PagerDuty

```yaml
receivers:
- name: 'pagerduty-critical'
  pagerduty_configs:
  - service_key: 'your_pagerduty_service_key'
    send_resolved: true
```

### Alert Routing

```yaml
route:
  group_by: ['alertname', 'job']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'slack-notifications'
  routes:
  - match:
      severity: critical
    receiver: 'pagerduty-critical'
    continue: true
  - match:
      severity: warning
    receiver: 'slack-notifications'
  - match_re:
      service: ^(frontend|backend)$
    receiver: 'team-app'
  - match_re:
      service: ^(postgres|mongodb|redis)$
    receiver: 'team-db'
```

## Setup Instructions

### Prometheus Setup

1. Install Prometheus:
   ```bash
   docker run -d --name prometheus \
     -p 9090:9090 \
     -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
     -v /path/to/alert_rules.yml:/etc/prometheus/alert_rules.yml \
     prom/prometheus
   ```

2. Access the Prometheus UI at `http://localhost:9090`

### Grafana Setup

1. Install Grafana:
   ```bash
   docker run -d --name grafana \
     -p 3000:3000 \
     -v /path/to/grafana/data:/var/lib/grafana \
     grafana/grafana
   ```

2. Access the Grafana UI at `http://localhost:3000` (default credentials: admin/admin)
3. Add Prometheus as a data source:
   - Name: Prometheus
   - Type: Prometheus
   - URL: http://prometheus:9090
   - Access: Server (default)
4. Import the provided dashboard JSON

### Alertmanager Setup

1. Create an alertmanager.yml configuration file
2. Install Alertmanager:
   ```bash
   docker run -d --name alertmanager \
     -p 9093:9093 \
     -v /path/to/alertmanager.yml:/etc/alertmanager/alertmanager.yml \
     prom/alertmanager
   ```

### Docker Compose Setup (Alternative)

For easier setup, use Docker Compose:

```yaml
version: '3'

services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./alert_rules.yml:/etc/prometheus/alert_rules.yml
    ports:
      - "9090:9090"
    restart: unless-stopped

  alertmanager:
    image: prom/alertmanager
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
    ports:
      - "9093:9093"
    restart: unless-stopped

  grafana:
    image: grafana/grafana
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "3000:3000"
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter
    ports:
      - "9100:9100"
    restart: unless-stopped

  postgres-exporter:
    image: wrouesnel/postgres_exporter
    environment:
      - DATA_SOURCE_NAME=postgresql://username:password@postgres:5432/newsroom?sslmode=disable
    ports:
      - "9187:9187"
    restart: unless-stopped

  redis-exporter:
    image: oliver006/redis_exporter
    environment:
      - REDIS_ADDR=redis://redis:6379
    ports:
      - "9121:9121"
    restart: unless-stopped

  mongodb-exporter:
    image: percona/mongodb_exporter
    environment:
      - MONGODB_URI=mongodb://username:password@mongodb:27017
    ports:
      - "9216:9216"
    restart: unless-stopped

  blackbox-exporter:
    image: prom/blackbox-exporter
    volumes:
      - ./blackbox.yml:/etc/blackbox_exporter/config.yml
    ports:
      - "9115:9115"
    restart: unless-stopped

volumes:
  grafana-data:
```

## Monitoring Best Practices

### Alert Design

- **Actionable**: Alerts should be actionable and point to a specific issue
- **Relevant**: Avoid alert fatigue by only alerting on important issues
- **Clear**: Alert messages should clearly describe the problem
- **Documented**: Each alert should have a runbook for resolution

### Dashboard Design

- **Hierarchical**: Start with high-level metrics and drill down
- **Consistent**: Use consistent colors and scales
- **Focused**: Each dashboard should have a specific purpose
- **Informative**: Include descriptions and documentation

### Metric Naming

- Use consistent naming conventions
- Include service and subsystem in metric names
- Use suffixes to indicate units (e.g., `_seconds`, `_bytes`)
- Document the meaning of each metric

### Retention Policies

- High-resolution metrics: 15 days
- Aggregated metrics: 6 months
- Business metrics: 2+ years

## Security Considerations

- Use authentication for all monitoring components
- Restrict access to monitoring dashboards
- Use HTTPS for all monitoring endpoints
- Regularly audit access to monitoring systems
- Encrypt sensitive data in alerts

