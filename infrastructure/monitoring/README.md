# Monitoring and Logging Infrastructure

This directory contains configuration files for setting up monitoring and logging for the News Room application.

## Monitoring Stack

The monitoring stack consists of:

1. **Prometheus**: For metrics collection and alerting
2. **Grafana**: For visualization and dashboards
3. **Alertmanager**: For alert routing and notifications
4. **Exporters**: For collecting metrics from various services

## Setup Instructions

### Prometheus

1. Install Prometheus:
   ```bash
   docker run -d --name prometheus \
     -p 9090:9090 \
     -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
     -v /path/to/alert_rules.yml:/etc/prometheus/alert_rules.yml \
     prom/prometheus
   ```

2. Access the Prometheus UI at `http://localhost:9090`

### Grafana

1. Install Grafana:
   ```bash
   docker run -d --name grafana \
     -p 3000:3000 \
     -v /path/to/grafana/data:/var/lib/grafana \
     grafana/grafana
   ```

2. Access the Grafana UI at `http://localhost:3000` (default credentials: admin/admin)
3. Add Prometheus as a data source
4. Import the provided dashboard JSON

### Alertmanager

1. Create an alertmanager.yml configuration file
2. Install Alertmanager:
   ```bash
   docker run -d --name alertmanager \
     -p 9093:9093 \
     -v /path/to/alertmanager.yml:/etc/alertmanager/alertmanager.yml \
     prom/alertmanager
   ```

### Exporters

Install the following exporters to collect metrics:

1. **Node Exporter**: For system metrics
   ```bash
   docker run -d --name node-exporter \
     -p 9100:9100 \
     prom/node-exporter
   ```

2. **PostgreSQL Exporter**: For PostgreSQL metrics
   ```bash
   docker run -d --name postgres-exporter \
     -p 9187:9187 \
     -e DATA_SOURCE_NAME="postgresql://username:password@hostname:5432/newsroom?sslmode=disable" \
     wrouesnel/postgres_exporter
   ```

3. **Redis Exporter**: For Redis metrics
   ```bash
   docker run -d --name redis-exporter \
     -p 9121:9121 \
     -e REDIS_ADDR=redis://hostname:6379 \
     oliver006/redis_exporter
   ```

4. **MongoDB Exporter**: For MongoDB metrics
   ```bash
   docker run -d --name mongodb-exporter \
     -p 9216:9216 \
     -e MONGODB_URI=mongodb://username:password@hostname:27017 \
     percona/mongodb_exporter
   ```

5. **Blackbox Exporter**: For endpoint monitoring
   ```bash
   docker run -d --name blackbox-exporter \
     -p 9115:9115 \
     -v /path/to/blackbox.yml:/etc/blackbox_exporter/config.yml \
     prom/blackbox-exporter
   ```

## Logging Infrastructure

For logging, we recommend using the ELK stack (Elasticsearch, Logstash, Kibana) or a managed service like Datadog or New Relic.

### ELK Stack Setup

1. Install Elasticsearch:
   ```bash
   docker run -d --name elasticsearch \
     -p 9200:9200 -p 9300:9300 \
     -e "discovery.type=single-node" \
     elasticsearch:7.10.0
   ```

2. Install Logstash:
   ```bash
   docker run -d --name logstash \
     -p 5000:5000 \
     -v /path/to/logstash.conf:/usr/share/logstash/pipeline/logstash.conf \
     logstash:7.10.0
   ```

3. Install Kibana:
   ```bash
   docker run -d --name kibana \
     -p 5601:5601 \
     -e "ELASTICSEARCH_HOSTS=http://elasticsearch:9200" \
     kibana:7.10.0
   ```

4. Install Filebeat on application servers:
   ```bash
   docker run -d --name filebeat \
     -v /path/to/filebeat.yml:/usr/share/filebeat/filebeat.yml \
     -v /var/log:/var/log:ro \
     elastic/filebeat:7.10.0
   ```

## Alert Notifications

Configure alert notifications through:

1. Email
2. Slack
3. PagerDuty
4. OpsGenie

Example Alertmanager configuration for Slack:

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

## Dashboard Access

Secure your monitoring dashboards:

1. Set up authentication for Grafana and Prometheus
2. Use HTTPS for all monitoring endpoints
3. Consider using a VPN or IP restrictions for access

## Metrics to Monitor

1. **System Metrics**:
   - CPU usage
   - Memory usage
   - Disk usage
   - Network traffic

2. **Application Metrics**:
   - Request rate
   - Error rate
   - Response time
   - Active users

3. **Database Metrics**:
   - Connection count
   - Query performance
   - Cache hit ratio
   - Replication lag

4. **Business Metrics**:
   - User registrations
   - Subscription conversions
   - Article views
   - User engagement

