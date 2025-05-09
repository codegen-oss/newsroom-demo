/**
 * Base Repository Class
 * 
 * This abstract class provides a foundation for implementing the repository pattern.
 * It defines common CRUD operations that specific repositories will implement.
 */

class BaseRepository {
  constructor(model) {
    this.model = model;
  }
  
  /**
   * Find a single entity by ID
   * @param {string} id - Entity ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Found entity or null
   */
  async findById(id, options = {}) {
    throw new Error('Method not implemented');
  }
  
  /**
   * Find a single entity by custom criteria
   * @param {Object} criteria - Query criteria
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Found entity or null
   */
  async findOne(criteria, options = {}) {
    throw new Error('Method not implemented');
  }
  
  /**
   * Find multiple entities by criteria
   * @param {Object} criteria - Query criteria
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Array of found entities
   */
  async find(criteria, options = {}) {
    throw new Error('Method not implemented');
  }
  
  /**
   * Create a new entity
   * @param {Object} data - Entity data
   * @param {Object} options - Creation options
   * @returns {Promise<Object>} - Created entity
   */
  async create(data, options = {}) {
    throw new Error('Method not implemented');
  }
  
  /**
   * Update an existing entity
   * @param {string} id - Entity ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object>} - Updated entity
   */
  async update(id, data, options = {}) {
    throw new Error('Method not implemented');
  }
  
  /**
   * Delete an entity
   * @param {string} id - Entity ID
   * @param {Object} options - Deletion options
   * @returns {Promise<boolean>} - Success status
   */
  async delete(id, options = {}) {
    throw new Error('Method not implemented');
  }
  
  /**
   * Count entities matching criteria
   * @param {Object} criteria - Query criteria
   * @param {Object} options - Count options
   * @returns {Promise<number>} - Count of matching entities
   */
  async count(criteria, options = {}) {
    throw new Error('Method not implemented');
  }
  
  /**
   * Check if entity exists
   * @param {Object} criteria - Query criteria
   * @returns {Promise<boolean>} - Whether entity exists
   */
  async exists(criteria) {
    throw new Error('Method not implemented');
  }
}

module.exports = BaseRepository;

