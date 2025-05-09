/**
 * Connection Pooling Configuration
 * 
 * This file contains configuration for database connection pooling,
 * including MongoDB, PostgreSQL, and Redis connection pools.
 */

const mongoose = require('mongoose');
const { Pool } = require('pg');
const Redis = require('ioredis');

/**
 * MongoDB Connection Pool Configuration
 */
const mongoConfig = {
  uri: process.env.MONGO_URI || 'mongodb://localhost:27017/newsroom',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: parseInt(process.env.MONGO_POOL_SIZE || '10', 10),
    serverSelectionTimeoutMS: parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT || '5000', 10),
    socketTimeoutMS: parseInt(process.env.MONGO_SOCKET_TIMEOUT || '45000', 10),
    family: 4, // Use IPv4, skip trying IPv6
    heartbeatFrequencyMS: 10000, // 10 seconds
    autoIndex: process.env.NODE_ENV !== 'production' // Disable auto-indexing in production
  }
};

/**
 * PostgreSQL Connection Pool Configuration
 */
const pgConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  database: process.env.POSTGRES_DB || 'newsroom',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  // Pool configuration
  max: parseInt(process.env.POSTGRES_POOL_MAX || '20', 10), // Maximum number of clients
  idleTimeoutMillis: parseInt(process.env.POSTGRES_POOL_IDLE_TIMEOUT || '30000', 10), // 30 seconds
  connectionTimeoutMillis: parseInt(process.env.POSTGRES_POOL_CONNECTION_TIMEOUT || '2000', 10), // 2 seconds
  application_name: 'newsroom-app'
};

/**
 * Redis Connection Pool Configuration
 */
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  keyPrefix: process.env.REDIS_PREFIX || 'newsroom:',
  // Connection pool options
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  connectTimeout: 10000, // 10 seconds
  disconnectTimeout: 2000, // 2 seconds
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

/**
 * Initialize MongoDB Connection Pool
 */
const initMongoDBPool = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection established successfully');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB connection disconnected');
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to application termination');
      process.exit(0);
    });
    
    await mongoose.connect(mongoConfig.uri, mongoConfig.options);
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

/**
 * Initialize PostgreSQL Connection Pool
 */
const initPostgreSQLPool = () => {
  try {
    const pool = new Pool(pgConfig);
    
    pool.on('connect', (client) => {
      console.log('New PostgreSQL client connected');
    });
    
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });
    
    pool.on('remove', (client) => {
      console.log('PostgreSQL client removed from pool');
    });
    
    process.on('SIGINT', async () => {
      await pool.end();
      console.log('PostgreSQL connection pool closed due to application termination');
      process.exit(0);
    });
    
    return pool;
  } catch (error) {
    console.error('Failed to initialize PostgreSQL connection pool:', error);
    throw error;
  }
};

/**
 * Initialize Redis Connection Pool
 */
const initRedisPool = () => {
  try {
    const redis = new Redis(redisConfig);
    
    redis.on('connect', () => {
      console.log('Redis connection established successfully');
    });
    
    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
    
    redis.on('close', () => {
      console.log('Redis connection closed');
    });
    
    process.on('SIGINT', async () => {
      await redis.quit();
      console.log('Redis connection closed due to application termination');
      process.exit(0);
    });
    
    return redis;
  } catch (error) {
    console.error('Failed to initialize Redis connection:', error);
    throw error;
  }
};

/**
 * Initialize All Connection Pools
 */
const initAllPools = async () => {
  const mongoConnection = await initMongoDBPool();
  const pgPool = initPostgreSQLPool();
  const redisClient = initRedisPool();
  
  return {
    mongoConnection,
    pgPool,
    redisClient
  };
};

module.exports = {
  mongoConfig,
  pgConfig,
  redisConfig,
  initMongoDBPool,
  initPostgreSQLPool,
  initRedisPool,
  initAllPools
};

