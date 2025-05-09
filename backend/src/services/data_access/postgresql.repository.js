/**
 * PostgreSQL Repository Implementation
 * 
 * This class implements the repository pattern for PostgreSQL tables.
 * It provides CRUD operations and query optimization for PostgreSQL data.
 */

const BaseRepository = require('./repository.base');
const { Pool } = require('pg');
const { redisClient } = require('../../config/redis/redis.config');

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  database: process.env.POSTGRES_DB || 'newsroom',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  max: parseInt(process.env.POSTGRES_POOL_MAX || '20', 10),
  idleTimeoutMillis: parseInt(process.env.POSTGRES_POOL_IDLE_TIMEOUT || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env.POSTGRES_POOL_CONNECTION_TIMEOUT || '2000', 10)
});

// Log pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

class PostgreSQLRepository extends BaseRepository {
  /**
   * Create a new PostgreSQL repository
   * @param {string} tableName - Table name
   * @param {Object} options - Repository options
   * @param {boolean} options.enableCache - Whether to enable Redis caching
   * @param {number} options.cacheTTL - Cache TTL in seconds
   * @param {string} options.cachePrefix - Cache key prefix
   * @param {string} options.primaryKey - Primary key column name
   */
  constructor(tableName, options = {}) {
    super(null); // No model for PostgreSQL
    this.tableName = tableName;
    this.primaryKey = options.primaryKey || 'id';
    this.enableCache = options.enableCache || false;
    this.cacheTTL = options.cacheTTL || 3600; // 1 hour default
    this.cachePrefix = options.cachePrefix || `postgresql:${tableName}:`;
  }
  
  /**
   * Generate cache key for an entity or query
   * @param {string|Object} identifier - Entity ID or query criteria
   * @returns {string} - Cache key
   */
  _getCacheKey(identifier) {
    if (typeof identifier === 'string') {
      return `${this.cachePrefix}${this.primaryKey}:${identifier}`;
    }
    
    return `${this.cachePrefix}query:${JSON.stringify(identifier)}`;
  }
  
  /**
   * Get data from cache
   * @param {string} key - Cache key
   * @returns {Promise<Object|null>} - Cached data or null
   */
  async _getFromCache(key) {
    if (!this.enableCache) return null;
    
    try {
      const cached = await redisClient.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Cache retrieval error:', error);
      return null;
    }
  }
  
  /**
   * Store data in cache
   * @param {string} key - Cache key
   * @param {Object} data - Data to cache
   * @param {number} ttl - Cache TTL in seconds
   * @returns {Promise<boolean>} - Success status
   */
  async _setCache(key, data, ttl = this.cacheTTL) {
    if (!this.enableCache) return false;
    
    try {
      await redisClient.setex(key, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn('Cache storage error:', error);
      return false;
    }
  }
  
  /**
   * Invalidate cache for an entity or query
   * @param {string|Object} identifier - Entity ID or query criteria
   * @returns {Promise<boolean>} - Success status
   */
  async _invalidateCache(identifier) {
    if (!this.enableCache) return false;
    
    try {
      const key = this._getCacheKey(identifier);
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.warn('Cache invalidation error:', error);
      return false;
    }
  }
  
  /**
   * Build a WHERE clause from criteria
   * @param {Object} criteria - Query criteria
   * @returns {Object} - WHERE clause and values
   */
  _buildWhereClause(criteria) {
    const values = [];
    const conditions = [];
    
    Object.entries(criteria).forEach(([key, value], index) => {
      if (value === null) {
        conditions.push(`${key} IS NULL`);
      } else if (Array.isArray(value)) {
        const placeholders = value.map((_, i) => `$${values.length + i + 1}`).join(', ');
        conditions.push(`${key} IN (${placeholders})`);
        values.push(...value);
      } else if (typeof value === 'object') {
        // Handle operators like $gt, $lt, etc.
        Object.entries(value).forEach(([op, opValue]) => {
          let operator;
          switch (op) {
            case '$gt': operator = '>'; break;
            case '$gte': operator = '>='; break;
            case '$lt': operator = '<'; break;
            case '$lte': operator = '<='; break;
            case '$ne': operator = '!='; break;
            case '$like': operator = 'LIKE'; break;
            case '$ilike': operator = 'ILIKE'; break;
            default: throw new Error(`Unsupported operator: ${op}`);
          }
          
          conditions.push(`${key} ${operator} $${values.length + 1}`);
          values.push(opValue);
        });
      } else {
        conditions.push(`${key} = $${values.length + 1}`);
        values.push(value);
      }
    });
    
    return {
      whereClause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
      values
    };
  }
  
  /**
   * Find a single entity by ID
   * @param {string} id - Entity ID
   * @param {Object} options - Query options
   * @param {boolean} options.useCache - Whether to use cache
   * @param {Array<string>} options.columns - Columns to select
   * @returns {Promise<Object>} - Found entity or null
   */
  async findById(id, options = {}) {
    const useCache = options.useCache !== false && this.enableCache;
    
    if (useCache) {
      const cacheKey = this._getCacheKey(id);
      const cached = await this._getFromCache(cacheKey);
      if (cached) return cached;
    }
    
    const columns = options.columns ? options.columns.join(', ') : '*';
    const query = `SELECT ${columns} FROM ${this.tableName} WHERE ${this.primaryKey} = $1`;
    
    const { rows } = await pool.query(query, [id]);
    const result = rows.length ? rows[0] : null;
    
    if (result && useCache) {
      await this._setCache(this._getCacheKey(id), result);
    }
    
    return result;
  }
  
  /**
   * Find a single entity by custom criteria
   * @param {Object} criteria - Query criteria
   * @param {Object} options - Query options
   * @param {boolean} options.useCache - Whether to use cache
   * @param {Array<string>} options.columns - Columns to select
   * @param {Object} options.orderBy - Order by clause
   * @returns {Promise<Object>} - Found entity or null
   */
  async findOne(criteria, options = {}) {
    const useCache = options.useCache !== false && this.enableCache;
    
    if (useCache) {
      const cacheKey = this._getCacheKey({ findOne: true, criteria, options });
      const cached = await this._getFromCache(cacheKey);
      if (cached) return cached;
    }
    
    const columns = options.columns ? options.columns.join(', ') : '*';
    const { whereClause, values } = this._buildWhereClause(criteria);
    
    let query = `SELECT ${columns} FROM ${this.tableName} ${whereClause}`;
    
    if (options.orderBy) {
      const orderClauses = Object.entries(options.orderBy)
        .map(([column, direction]) => `${column} ${direction.toUpperCase()}`);
      query += ` ORDER BY ${orderClauses.join(', ')}`;
    }
    
    query += ' LIMIT 1';
    
    const { rows } = await pool.query(query, values);
    const result = rows.length ? rows[0] : null;
    
    if (result && useCache) {
      await this._setCache(this._getCacheKey({ findOne: true, criteria, options }), result);
    }
    
    return result;
  }
  
  /**
   * Find multiple entities by criteria
   * @param {Object} criteria - Query criteria
   * @param {Object} options - Query options
   * @param {boolean} options.useCache - Whether to use cache
   * @param {Array<string>} options.columns - Columns to select
   * @param {Object} options.orderBy - Order by clause
   * @param {number} options.limit - Maximum number of results
   * @param {number} options.offset - Number of results to skip
   * @returns {Promise<Array>} - Array of found entities
   */
  async find(criteria, options = {}) {
    const useCache = options.useCache !== false && this.enableCache;
    
    if (useCache) {
      const cacheKey = this._getCacheKey({ find: true, criteria, options });
      const cached = await this._getFromCache(cacheKey);
      if (cached) return cached;
    }
    
    const columns = options.columns ? options.columns.join(', ') : '*';
    const { whereClause, values } = this._buildWhereClause(criteria);
    
    let query = `SELECT ${columns} FROM ${this.tableName} ${whereClause}`;
    
    if (options.orderBy) {
      const orderClauses = Object.entries(options.orderBy)
        .map(([column, direction]) => `${column} ${direction.toUpperCase()}`);
      query += ` ORDER BY ${orderClauses.join(', ')}`;
    }
    
    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }
    
    if (options.offset) {
      query += ` OFFSET ${options.offset}`;
    }
    
    const { rows } = await pool.query(query, values);
    
    if (useCache) {
      await this._setCache(this._getCacheKey({ find: true, criteria, options }), rows);
    }
    
    return rows;
  }
  
  /**
   * Create a new entity
   * @param {Object} data - Entity data
   * @param {Object} options - Creation options
   * @param {boolean} options.returnFields - Whether to return all fields or just the ID
   * @returns {Promise<Object>} - Created entity
   */
  async create(data, options = {}) {
    const returnFields = options.returnFields !== false;
    
    const columns = Object.keys(data);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(data);
    
    const returning = returnFields ? '*' : this.primaryKey;
    const query = `
      INSERT INTO ${this.tableName} (${columns.join(', ')})
      VALUES (${placeholders})
      RETURNING ${returning}
    `;
    
    const { rows } = await pool.query(query, values);
    
    // Invalidate any collection-level cache
    if (this.enableCache) {
      await this._invalidateCache({});
    }
    
    return rows[0];
  }
  
  /**
   * Update an existing entity
   * @param {string} id - Entity ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @param {boolean} options.returnFields - Whether to return all fields or just the ID
   * @returns {Promise<Object>} - Updated entity
   */
  async update(id, data, options = {}) {
    const returnFields = options.returnFields !== false;
    
    const columns = Object.keys(data);
    const setClauses = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');
    const values = [...Object.values(data), id];
    
    const returning = returnFields ? '*' : this.primaryKey;
    const query = `
      UPDATE ${this.tableName}
      SET ${setClauses}
      WHERE ${this.primaryKey} = $${values.length}
      RETURNING ${returning}
    `;
    
    const { rows } = await pool.query(query, values);
    
    // Invalidate cache for this entity
    if (this.enableCache) {
      await this._invalidateCache(id);
      await this._invalidateCache({});
    }
    
    return rows.length ? rows[0] : null;
  }
  
  /**
   * Delete an entity
   * @param {string} id - Entity ID
   * @param {Object} options - Deletion options
   * @param {boolean} options.returnFields - Whether to return the deleted entity
   * @returns {Promise<boolean|Object>} - Success status or deleted entity
   */
  async delete(id, options = {}) {
    const returnFields = options.returnFields === true;
    
    const returning = returnFields ? '*' : '';
    const query = `
      DELETE FROM ${this.tableName}
      WHERE ${this.primaryKey} = $1
      ${returning ? 'RETURNING *' : ''}
    `;
    
    const { rows, rowCount } = await pool.query(query, [id]);
    
    // Invalidate cache for this entity
    if (this.enableCache) {
      await this._invalidateCache(id);
      await this._invalidateCache({});
    }
    
    return returnFields ? (rows.length ? rows[0] : null) : rowCount > 0;
  }
  
  /**
   * Count entities matching criteria
   * @param {Object} criteria - Query criteria
   * @param {Object} options - Count options
   * @param {boolean} options.useCache - Whether to use cache
   * @returns {Promise<number>} - Count of matching entities
   */
  async count(criteria, options = {}) {
    const useCache = options.useCache !== false && this.enableCache;
    
    if (useCache) {
      const cacheKey = this._getCacheKey({ count: true, criteria });
      const cached = await this._getFromCache(cacheKey);
      if (cached !== null) return parseInt(cached, 10);
    }
    
    const { whereClause, values } = this._buildWhereClause(criteria);
    const query = `SELECT COUNT(*) FROM ${this.tableName} ${whereClause}`;
    
    const { rows } = await pool.query(query, values);
    const count = parseInt(rows[0].count, 10);
    
    if (useCache) {
      await this._setCache(this._getCacheKey({ count: true, criteria }), count);
    }
    
    return count;
  }
  
  /**
   * Check if entity exists
   * @param {Object} criteria - Query criteria
   * @returns {Promise<boolean>} - Whether entity exists
   */
  async exists(criteria) {
    const { whereClause, values } = this._buildWhereClause(criteria);
    const query = `SELECT EXISTS(SELECT 1 FROM ${this.tableName} ${whereClause})`;
    
    const { rows } = await pool.query(query, values);
    return rows[0].exists;
  }
  
  /**
   * Execute a raw SQL query
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @param {Object} options - Query options
   * @param {boolean} options.useCache - Whether to use cache
   * @returns {Promise<Object>} - Query result
   */
  async query(sql, params = [], options = {}) {
    const useCache = options.useCache !== false && this.enableCache;
    
    if (useCache) {
      const cacheKey = this._getCacheKey({ query: sql, params });
      const cached = await this._getFromCache(cacheKey);
      if (cached) return cached;
    }
    
    const result = await pool.query(sql, params);
    
    if (useCache) {
      await this._setCache(this._getCacheKey({ query: sql, params }), result);
    }
    
    return result;
  }
  
  /**
   * Execute a transaction with multiple queries
   * @param {Function} callback - Transaction callback
   * @returns {Promise<any>} - Transaction result
   */
  async transaction(callback) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const result = await callback({
        query: (sql, params) => client.query(sql, params),
        client
      });
      
      await client.query('COMMIT');
      
      // Invalidate collection-level cache after transaction
      if (this.enableCache) {
        await this._invalidateCache({});
      }
      
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = PostgreSQLRepository;

