/**
 * Redis Configuration
 * 
 * This file contains the configuration for Redis cache, including:
 * - Session storage
 * - Article view caching
 * - User preferences caching
 * - Rate limiting configuration
 */

const Redis = require('ioredis');

// Environment variables with defaults
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
const REDIS_DB = parseInt(process.env.REDIS_DB || '0', 10);
const REDIS_PREFIX = process.env.REDIS_PREFIX || 'newsroom:';

// Redis client configuration
const redisConfig = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD || undefined,
  db: REDIS_DB,
  keyPrefix: REDIS_PREFIX,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

// Create Redis client
const redisClient = new Redis(redisConfig);

// Session storage configuration
const sessionConfig = {
  store: {
    prefix: `${REDIS_PREFIX}session:`,
    ttl: 86400 * 7, // 7 days in seconds
  },
  cookie: {
    maxAge: 86400 * 7 * 1000, // 7 days in milliseconds
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  },
  secret: process.env.SESSION_SECRET || 'newsroom-session-secret',
  resave: false,
  saveUninitialized: false,
  name: 'newsroom.sid'
};

// Article view caching configuration
const articleCacheConfig = {
  prefix: `${REDIS_PREFIX}article:`,
  ttl: 3600, // 1 hour in seconds
  popularArticlesTTL: 300, // 5 minutes in seconds
  maxCachedArticles: 1000
};

// User preferences caching configuration
const userPreferencesCacheConfig = {
  prefix: `${REDIS_PREFIX}user:prefs:`,
  ttl: 86400, // 24 hours in seconds
};

// Rate limiting configuration
const rateLimitConfig = {
  prefix: `${REDIS_PREFIX}ratelimit:`,
  points: 100, // Number of points
  duration: 60, // Per 60 seconds
  blockDuration: 600, // Block for 10 minutes if exceeded
  // Different limits for different routes
  routes: {
    login: {
      points: 5,
      duration: 60,
      blockDuration: 300
    },
    register: {
      points: 3,
      duration: 3600,
      blockDuration: 86400
    },
    api: {
      points: 1000,
      duration: 60,
      blockDuration: 0
    }
  }
};

// Helper functions for Redis operations
const redisHelpers = {
  // Session storage helpers
  session: {
    async get(sessionId) {
      return await redisClient.get(`${sessionConfig.store.prefix}${sessionId}`);
    },
    async set(sessionId, data, ttl = sessionConfig.store.ttl) {
      return await redisClient.setex(`${sessionConfig.store.prefix}${sessionId}`, ttl, data);
    },
    async delete(sessionId) {
      return await redisClient.del(`${sessionConfig.store.prefix}${sessionId}`);
    }
  },
  
  // Article cache helpers
  articles: {
    async getArticle(articleId) {
      return await redisClient.get(`${articleCacheConfig.prefix}${articleId}`);
    },
    async setArticle(articleId, data, ttl = articleCacheConfig.ttl) {
      return await redisClient.setex(`${articleCacheConfig.prefix}${articleId}`, ttl, JSON.stringify(data));
    },
    async deleteArticle(articleId) {
      return await redisClient.del(`${articleCacheConfig.prefix}${articleId}`);
    },
    async getPopularArticles() {
      return await redisClient.get(`${articleCacheConfig.prefix}popular`);
    },
    async setPopularArticles(articles, ttl = articleCacheConfig.popularArticlesTTL) {
      return await redisClient.setex(`${articleCacheConfig.prefix}popular`, ttl, JSON.stringify(articles));
    }
  },
  
  // User preferences cache helpers
  userPreferences: {
    async getUserPreferences(userId) {
      return await redisClient.get(`${userPreferencesCacheConfig.prefix}${userId}`);
    },
    async setUserPreferences(userId, data, ttl = userPreferencesCacheConfig.ttl) {
      return await redisClient.setex(`${userPreferencesCacheConfig.prefix}${userId}`, ttl, JSON.stringify(data));
    },
    async deleteUserPreferences(userId) {
      return await redisClient.del(`${userPreferencesCacheConfig.prefix}${userId}`);
    }
  },
  
  // Rate limiting helpers
  rateLimit: {
    async consume(identifier, route = 'api') {
      const routeConfig = rateLimitConfig.routes[route] || rateLimitConfig;
      const key = `${rateLimitConfig.prefix}${route}:${identifier}`;
      
      // Check if user is blocked
      const isBlocked = await redisClient.get(`${key}:blocked`);
      if (isBlocked) {
        return { blocked: true, remaining: 0, resetTime: parseInt(isBlocked, 10) };
      }
      
      // Get current count
      const current = await redisClient.get(key);
      const count = current ? parseInt(current, 10) : 0;
      
      if (count >= routeConfig.points) {
        // Block the user if configured
        if (routeConfig.blockDuration > 0) {
          const blockUntil = Date.now() + (routeConfig.blockDuration * 1000);
          await redisClient.setex(`${key}:blocked`, routeConfig.blockDuration, blockUntil.toString());
        }
        
        return { blocked: routeConfig.blockDuration > 0, remaining: 0, resetTime: Date.now() + (routeConfig.duration * 1000) };
      }
      
      // Increment count
      await redisClient.incr(key);
      
      // Set expiry if it's a new key
      if (count === 0) {
        await redisClient.expire(key, routeConfig.duration);
      }
      
      return { blocked: false, remaining: routeConfig.points - (count + 1), resetTime: Date.now() + (routeConfig.duration * 1000) };
    }
  }
};

module.exports = {
  redisClient,
  redisConfig,
  sessionConfig,
  articleCacheConfig,
  userPreferencesCacheConfig,
  rateLimitConfig,
  redisHelpers
};

