// API Key Management for News Room API

const crypto = require('crypto');

/**
 * API Key Management Service
 */
class ApiKeyManager {
  /**
   * Generate a new API key
   * @param {string} userId - User ID
   * @param {string} name - Name of the API key
   * @param {number} expiresInDays - Number of days until expiration (0 for no expiration)
   * @returns {Object} API key details
   */
  static generateApiKey(userId, name, expiresInDays = 0) {
    // Generate a random API key
    const apiKey = crypto.randomBytes(32).toString('hex');
    
    // Generate a prefix for easier identification
    const prefix = 'nrm_' + crypto.randomBytes(4).toString('hex');
    
    // Calculate expiration date
    const expiresAt = expiresInDays > 0 
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;
    
    // Hash the API key for storage
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    
    return {
      userId,
      name,
      apiKey: `${prefix}_${apiKey}`,
      hashedKey,
      prefix,
      createdAt: new Date(),
      expiresAt,
      lastUsedAt: null,
      isActive: true
    };
  }
  
  /**
   * Validate an API key
   * @param {string} apiKey - API key to validate
   * @param {Object} storedKeyData - Stored API key data from database
   * @returns {boolean} Whether the API key is valid
   */
  static validateApiKey(apiKey, storedKeyData) {
    if (!apiKey || !storedKeyData) return false;
    
    // Check if the API key is active
    if (!storedKeyData.isActive) return false;
    
    // Check if the API key has expired
    if (storedKeyData.expiresAt && new Date() > storedKeyData.expiresAt) return false;
    
    // Extract the actual key part (remove prefix)
    const keyParts = apiKey.split('_');
    if (keyParts.length !== 3) return false;
    
    const actualKey = keyParts[2];
    
    // Hash the provided key and compare with stored hash
    const hashedKey = crypto.createHash('sha256').update(actualKey).digest('hex');
    
    return hashedKey === storedKeyData.hashedKey;
  }
  
  /**
   * Revoke an API key
   * @param {string} apiKeyId - ID of the API key to revoke
   * @returns {Object} Result of the operation
   */
  static revokeApiKey(apiKeyId) {
    // In a real implementation, this would update the database
    return {
      success: true,
      message: `API key ${apiKeyId} has been revoked`
    };
  }
  
  /**
   * Rotate an API key (revoke old key and generate new one)
   * @param {string} apiKeyId - ID of the API key to rotate
   * @param {Object} keyData - Original key data
   * @returns {Object} New API key details
   */
  static rotateApiKey(apiKeyId, keyData) {
    // Revoke the old key
    this.revokeApiKey(apiKeyId);
    
    // Generate a new key with the same parameters
    return this.generateApiKey(
      keyData.userId,
      keyData.name,
      keyData.expiresAt ? Math.ceil((keyData.expiresAt - new Date()) / (24 * 60 * 60 * 1000)) : 0
    );
  }
}

module.exports = ApiKeyManager;

