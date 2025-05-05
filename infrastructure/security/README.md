# Security Configuration for News Room

This directory contains security configuration files for the News Room application.

## Security Components

1. **CORS Configuration**: Controls cross-origin resource sharing
2. **Rate Limiting**: Prevents abuse and DoS attacks
3. **API Key Management**: Secures API access
4. **SSL/TLS Configuration**: Ensures encrypted communication

## CORS Configuration

The CORS configuration (`cors_config.js`) defines which origins can access the API and what methods and headers are allowed.

### Implementation

```javascript
const cors = require('cors');
const corsOptions = require('./infrastructure/security/cors_config');

app.use(cors(corsOptions));
```

## Rate Limiting

Rate limiting (`rate_limiting.js`) prevents abuse by limiting the number of requests a client can make in a given time period.

### Implementation

```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const rateLimitConfig = require('./infrastructure/security/rate_limiting');

// Global rate limiting
app.use(rateLimit(rateLimitConfig.ipRateLimit));

// Auth endpoint rate limiting
app.use('/api/auth', rateLimit(rateLimitConfig.authRateLimit));

// API endpoint rate limiting
app.use('/api', rateLimit(rateLimitConfig.apiKeyRateLimit));
```

## API Key Management

The API key management system (`api_key_management.js`) provides functions for generating, validating, and revoking API keys.

### Implementation

```javascript
const ApiKeyManager = require('./infrastructure/security/api_key_management');

// Generate a new API key
const apiKey = ApiKeyManager.generateApiKey(userId, 'My API Key', 365);

// Validate an API key
const isValid = ApiKeyManager.validateApiKey(providedApiKey, storedKeyData);
```

## SSL/TLS Configuration

The SSL/TLS configuration (`ssl_config.js`) ensures secure communication between clients and the server.

### Implementation

```javascript
const https = require('https');
const helmet = require('helmet');
const sslConfig = require('./infrastructure/security/ssl_config');

// Apply security headers
app.use(helmet(sslConfig.getSecurityHeaders()));

// Create HTTPS server
const httpsOptions = sslConfig.getHttpsOptions();
if (httpsOptions) {
  https.createServer(httpsOptions, app).listen(443);
}
```

## Security Best Practices

### Authentication and Authorization

1. Use JWT for authentication with short expiration times
2. Implement refresh token rotation
3. Use role-based access control (RBAC)
4. Store passwords using bcrypt with appropriate salt rounds

### Data Protection

1. Encrypt sensitive data at rest
2. Use HTTPS for all communications
3. Implement proper input validation
4. Use parameterized queries to prevent SQL injection

### Infrastructure Security

1. Keep all dependencies up to date
2. Use a Web Application Firewall (WAF)
3. Implement network segmentation
4. Regularly scan for vulnerabilities

### Monitoring and Incident Response

1. Log security events
2. Set up alerts for suspicious activities
3. Have an incident response plan
4. Conduct regular security audits

## Environment-Specific Configurations

### Development

- Less strict CORS policy
- Detailed error messages
- No rate limiting for local development

### Staging

- Mimics production security settings
- Uses separate API keys and credentials
- May have higher rate limits for testing

### Production

- Strict CORS policy
- Limited error information exposed to clients
- Full rate limiting enforcement
- Regular security audits and monitoring

