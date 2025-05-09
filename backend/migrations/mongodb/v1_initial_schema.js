/**
 * MongoDB Initial Schema Migration
 * 
 * This migration creates the initial collections and indexes for MongoDB.
 */

const mongoose = require('mongoose');

module.exports = {
  async up() {
    try {
      console.log('Running MongoDB initial schema migration...');
      
      // Create collections if they don't exist
      const collections = [
        'users',
        'userInterests',
        'userHistory',
        'articles',
        'organizations',
        'organizationMembers'
      ];
      
      const db = mongoose.connection.db;
      const existingCollections = await db.listCollections().toArray();
      const existingCollectionNames = existingCollections.map(c => c.name);
      
      for (const collection of collections) {
        if (!existingCollectionNames.includes(collection)) {
          await db.createCollection(collection);
          console.log(`Created collection: ${collection}`);
        }
      }
      
      // Create indexes
      await db.collection('users').createIndexes([
        { key: { email: 1 }, unique: true },
        { key: { subscriptionTier: 1 } },
        { key: { subscriptionStatus: 1 } },
        { key: { createdAt: 1 } }
      ]);
      
      await db.collection('userInterests').createIndexes([
        { key: { userId: 1 } },
        { key: { categories: 1 } },
        { key: { regions: 1 } },
        { key: { topics: 1 } }
      ]);
      
      await db.collection('userHistory').createIndexes([
        { key: { userId: 1 } },
        { key: { articleId: 1 } },
        { key: { readAt: -1 } },
        { key: { userId: 1, articleId: 1 }, unique: true },
        { key: { userId: 1, saved: 1 } }
      ]);
      
      await db.collection('articles').createIndexes([
        { key: { title: 'text', content: 'text', summary: 'text' } },
        { key: { publishedAt: -1 } },
        { key: { categories: 1 } },
        { key: { regions: 1 } },
        { key: { topics: 1 } },
        { key: { accessTier: 1 } },
        { key: { popularity: -1 } },
        { key: { author: 1 } }
      ]);
      
      await db.collection('organizations').createIndexes([
        { key: { name: 1 } },
        { key: { 'subscription.renewalDate': 1 } },
        { key: { industry: 1 } }
      ]);
      
      await db.collection('organizationMembers').createIndexes([
        { key: { organizationId: 1 } },
        { key: { userId: 1 } },
        { key: { organizationId: 1, userId: 1 }, unique: true },
        { key: { organizationId: 1, role: 1 } }
      ]);
      
      console.log('MongoDB initial schema migration completed successfully');
    } catch (error) {
      console.error('Error in MongoDB initial schema migration:', error);
      throw error;
    }
  },
  
  async down() {
    try {
      console.log('Rolling back MongoDB initial schema migration...');
      
      const db = mongoose.connection.db;
      
      // Drop collections
      await db.collection('users').drop();
      await db.collection('userInterests').drop();
      await db.collection('userHistory').drop();
      await db.collection('articles').drop();
      await db.collection('organizations').drop();
      await db.collection('organizationMembers').drop();
      
      console.log('MongoDB initial schema migration rollback completed successfully');
    } catch (error) {
      console.error('Error in MongoDB initial schema migration rollback:', error);
      throw error;
    }
  }
};

