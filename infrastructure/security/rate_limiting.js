// Rate Limiting Configuration for News Room API

const rateLimitConfig = {
  // Rate limiting by IP address
  ipRateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes',
    skipSuccessfulRequests: false, // count successful requests against the rate limit
    keyGenerator: (req) => {
      return req.ip; // use the IP address as the key
    },
    skip: (req) => {
      // Skip rate limiting for certain paths or authenticated users
      return req.path === '/health' || (req.user && req.user.tier === 'organization');
    }
  },
  
  // Rate limiting for authentication endpoints
  authRateLimit: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 login attempts per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts, please try again after an hour',
    skipSuccessfulRequests: false,
    keyGenerator: (req) => {
      // Use both IP and username/email for login attempts
      return `${req.ip}-${req.body.email || req.body.username || ''}`;
    }
  },
  
  // Rate limiting for API endpoints based on API key
  apiKeyRateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: (req) => {
      // Different limits based on subscription tier
      if (req.user && req.user.tier === 'organization') {
        return 1000; // 1000 requests per minute for organization tier
      } else if (req.user && req.user.tier === 'individual') {
        return 100; // 100 requests per minute for individual paid tier
      } else {
        return 20; // 20 requests per minute for free tier
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
    message: 'API rate limit exceeded, please upgrade your plan for higher limits',
    keyGenerator: (req) => {
      // Use API key or user ID as the key
      return req.headers['x-api-key'] || (req.user && req.user.id) || req.ip;
    }
  },
  
  // Store for rate limit data (default is memory, can be replaced with Redis)
  store: null // Set to Redis store in production
};

module.exports = rateLimitConfig;

