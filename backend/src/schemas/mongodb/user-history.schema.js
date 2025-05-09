/**
 * MongoDB Schema for UserHistory Collection
 * 
 * This schema defines the structure for tracking user interaction history with articles.
 * It includes read timestamps, time spent, completion status, reactions, and saved status.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserHistorySchema = new Schema({
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
  articleId: {
    type: String,
    required: true,
    ref: 'Article'
  },
  readAt: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  reactions: {
    type: [String],
    default: []
  },
  saved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'userHistory'
});

// Indexes for performance optimization
UserHistorySchema.index({ userId: 1 });
UserHistorySchema.index({ articleId: 1 });
UserHistorySchema.index({ readAt: -1 });
UserHistorySchema.index({ userId: 1, articleId: 1 }, { unique: true });
UserHistorySchema.index({ userId: 1, saved: 1 });

module.exports = mongoose.model('UserHistory', UserHistorySchema);

