/**
 * MongoDB Schema for Users Collection
 * 
 * This schema defines the structure for user data in the MongoDB database.
 * It includes user authentication details, profile information, and subscription data.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  profileImage: {
    type: String,
    default: null
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'individual', 'organization'],
    default: 'free'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'expired', 'trial'],
    default: 'active'
  },
  subscriptionExpiry: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  preferences: {
    theme: {
      type: String,
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    emailFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'none'],
      default: 'weekly'
    }
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Indexes for performance optimization
UserSchema.index({ email: 1 });
UserSchema.index({ subscriptionTier: 1 });
UserSchema.index({ subscriptionStatus: 1 });
UserSchema.index({ createdAt: 1 });

module.exports = mongoose.model('User', UserSchema);

