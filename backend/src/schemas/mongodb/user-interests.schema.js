/**
 * MongoDB Schema for UserInterests Collection
 * 
 * This schema defines the structure for user interests data in the MongoDB database.
 * It tracks user preferences for content categories, regions, topics, sources, and authors.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserInterestSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  categories: {
    type: [String],
    default: []
  },
  regions: {
    type: [String],
    default: []
  },
  topics: {
    type: [String],
    default: []
  },
  sources: {
    type: [String],
    default: []
  },
  followedAuthors: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'userInterests'
});

// Indexes for performance optimization
UserInterestSchema.index({ userId: 1 });
UserInterestSchema.index({ categories: 1 });
UserInterestSchema.index({ regions: 1 });
UserInterestSchema.index({ topics: 1 });

module.exports = mongoose.model('UserInterest', UserInterestSchema);

