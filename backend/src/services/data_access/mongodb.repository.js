/**
 * MongoDB Repository Implementation
 * 
 * This class implements the repository pattern for MongoDB models.
 * It provides CRUD operations and query optimization for MongoDB collections.
 */

const BaseRepository = require('./repository.base');
const { redisClient } = require('../../config/redis/redis.config');

class MongoDBRepository extends BaseRepository {
  /**
   * Create a new MongoDB repository
   * @param {Object} model - Mongoose model
   * @param {Object} options - Repository options
   * @param {boolean} options.enableCache - Whether to enable Redis caching
   * @param {number} options.cacheTTL - Cache TTL in seconds
   * @param {string} options.cachePrefix - Cache key prefix
   */
  constructor(model, options = {}) {
    super(model);
    this.enableCache = options.enableCache || false;
    this.cacheTTL = options.cacheTTL || 3600; // 1 hour default
    this.cachePrefix = options.cachePrefix || `mongodb:${model.collection.name}:`;
  }
  
  /**
   * Generate cache key for an entity or query
   * @param {string|Object} identifier - Entity ID or query criteria
   * @returns {string} - Cache key
   */
  _getCacheKey(identifier) {
    if (typeof identifier === 'string') {
      return `${this.cachePrefix}id:${identifier}`;
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
   * Find a single entity by ID
   * @param {string} id - Entity ID
   * @param {Object} options - Query options
   * @param {boolean} options.useCache - Whether to use cache
   * @param {Array<string>} options.populate - Fields to populate
   * @param {Object} options.select - Fields to select
   * @returns {Promise<Object>} - Found entity or null
   */
  async findById(id, options = {}) {
    const useCache = options.useCache !== false && this.enableCache;
    
    if (useCache) {
      const cacheKey = this._getCacheKey(id);
      const cached = await this._getFromCache(cacheKey);
      if (cached) return cached;
    }
    
    let query = this.model.findById(id);
    
    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach(field => {
          query = query.populate(field);
        });
      } else {
        query = query.populate(options.populate);
      }
    }
    
    if (options.select) {
      query = query.select(options.select);
    }
    
    const result = await query.lean().exec();
    
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
   * @param {Array<string>} options.populate - Fields to populate
   * @param {Object} options.select - Fields to select
   * @param {Object} options.sort - Sort criteria
   * @returns {Promise<Object>} - Found entity or null
   */
  async findOne(criteria, options = {}) {
    const useCache = options.useCache !== false && this.enableCache;
    
    if (useCache) {
      const cacheKey = this._getCacheKey(criteria);
      const cached = await this._getFromCache(cacheKey);
      if (cached) return cached;
    }
    
    let query = this.model.findOne(criteria);
    
    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach(field => {
          query = query.populate(field);
        });
      } else {
        query = query.populate(options.populate);
      }
    }
    
    if (options.select) {
      query = query.select(options.select);
    }
    
    if (options.sort) {
      query = query.sort(options.sort);
    }
    
    const result = await query.lean().exec();
    
    if (result && useCache) {
      await this._setCache(this._getCacheKey(criteria), result);
    }
    
    return result;
  }
  
  /**
   * Find multiple entities by criteria
   * @param {Object} criteria - Query criteria
   * @param {Object} options - Query options
   * @param {boolean} options.useCache - Whether to use cache
   * @param {Array<string>} options.populate - Fields to populate
   * @param {Object} options.select - Fields to select
   * @param {Object} options.sort - Sort criteria
   * @param {number} options.limit - Maximum number of results
   * @param {number} options.skip - Number of results to skip
   * @returns {Promise<Array>} - Array of found entities
   */
  async find(criteria, options = {}) {
    const useCache = options.useCache !== false && this.enableCache;
    const cacheKey = useCache ? this._getCacheKey({
      criteria,
      options: {
        populate: options.populate,
        select: options.select,
        sort: options.sort,
        limit: options.limit,
        skip: options.skip
      }
    }) : null;
    
    if (useCache) {
      const cached = await this._getFromCache(cacheKey);
      if (cached) return cached;
    }
    
    let query = this.model.find(criteria);
    
    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach(field => {
          query = query.populate(field);
        });
      } else {
        query = query.populate(options.populate);
      }
    }
    
    if (options.select) {
      query = query.select(options.select);
    }
    
    if (options.sort) {
      query = query.sort(options.sort);
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.skip) {
      query = query.skip(options.skip);
    }
    
    const results = await query.lean().exec();
    
    if (useCache) {
      await this._setCache(cacheKey, results);
    }
    
    return results;
  }
  
  /**
   * Create a new entity
   * @param {Object} data - Entity data
   * @param {Object} options - Creation options
   * @param {boolean} options.validateBeforeSave - Whether to validate before saving
   * @returns {Promise<Object>} - Created entity
   */
  async create(data, options = {}) {
    const entity = new this.model(data);
    const savedEntity = await entity.save(options);
    
    // Invalidate any collection-level cache
    if (this.enableCache) {
      await this._invalidateCache({});
    }
    
    return savedEntity.toObject();
  }
  
  /**
   * Update an existing entity
   * @param {string} id - Entity ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @param {boolean} options.new - Whether to return the updated document
   * @param {boolean} options.runValidators - Whether to validate the update
   * @returns {Promise<Object>} - Updated entity
   */
  async update(id, data, options = {}) {
    const updateOptions = {
      new: options.new !== false,
      runValidators: options.runValidators !== false
    };
    
    const updatedEntity = await this.model.findByIdAndUpdate(id, data, updateOptions).lean().exec();
    
    // Invalidate cache for this entity
    if (this.enableCache) {
      await this._invalidateCache(id);
      await this._invalidateCache({});
    }
    
    return updatedEntity;
  }
  
  /**
   * Delete an entity
   * @param {string} id - Entity ID
   * @param {Object} options - Deletion options
   * @returns {Promise<boolean>} - Success status
   */
  async delete(id, options = {}) {
    const result = await this.model.findByIdAndDelete(id).exec();
    
    // Invalidate cache for this entity
    if (this.enableCache) {
      await this._invalidateCache(id);
      await this._invalidateCache({});
    }
    
    return !!result;
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
    const cacheKey = useCache ? this._getCacheKey({ count: true, criteria }) : null;
    
    if (useCache) {
      const cached = await this._getFromCache(cacheKey);
      if (cached !== null) return cached;
    }
    
    const count = await this.model.countDocuments(criteria).exec();
    
    if (useCache) {
      await this._setCache(cacheKey, count);
    }
    
    return count;
  }
  
  /**
   * Check if entity exists
   * @param {Object} criteria - Query criteria
   * @returns {Promise<boolean>} - Whether entity exists
   */
  async exists(criteria) {
    return !!(await this.model.exists(criteria));
  }
  
  /**
   * Perform aggregation
   * @param {Array} pipeline - Aggregation pipeline
   * @param {Object} options - Aggregation options
   * @param {boolean} options.useCache - Whether to use cache
   * @returns {Promise<Array>} - Aggregation results
   */
  async aggregate(pipeline, options = {}) {
    const useCache = options.useCache !== false && this.enableCache;
    const cacheKey = useCache ? this._getCacheKey({ aggregate: true, pipeline }) : null;
    
    if (useCache) {
      const cached = await this._getFromCache(cacheKey);
      if (cached) return cached;
    }
    
    const results = await this.model.aggregate(pipeline).exec();
    
    if (useCache) {
      await this._setCache(cacheKey, results);
    }
    
    return results;
  }
  
  /**
   * Perform bulk write operations
   * @param {Array} operations - Bulk write operations
   * @param {Object} options - Bulk write options
   * @returns {Promise<Object>} - Bulk write results
   */
  async bulkWrite(operations, options = {}) {
    const result = await this.model.bulkWrite(operations, options);
    
    // Invalidate collection-level cache
    if (this.enableCache) {
      await this._invalidateCache({});
    }
    
    return result;
  }
}

module.exports = MongoDBRepository;

