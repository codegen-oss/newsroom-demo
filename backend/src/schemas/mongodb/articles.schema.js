/**
 * MongoDB Schema for Articles Collection
 * 
 * This schema defines the structure for article data in the MongoDB database.
 * It includes article content, metadata, categorization, and access control information.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  source: {
    type: String,
    required: true
  },
  sourceUrl: {
    type: String
  },
  author: {
    type: String,
    required: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
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
  readTimeMinutes: {
    type: Number,
    min: 1,
    default: 5
  },
  accessTier: {
    type: String,
    enum: ['free', 'premium', 'organization'],
    default: 'free'
  },
  featuredImage: {
    type: String
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  popularity: {
    type: Number,
    default: 0
  },
  relatedArticles: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  collection: 'articles'
});

// Indexes for performance optimization
ArticleSchema.index({ title: 'text', content: 'text', summary: 'text' });
ArticleSchema.index({ publishedAt: -1 });
ArticleSchema.index({ categories: 1 });
ArticleSchema.index({ regions: 1 });
ArticleSchema.index({ topics: 1 });
ArticleSchema.index({ accessTier: 1 });
ArticleSchema.index({ popularity: -1 });
ArticleSchema.index({ author: 1 });

module.exports = mongoose.model('Article', ArticleSchema);

