/**
 * MongoDB Schema for OrganizationMembers Collection
 * 
 * This schema defines the structure for organization membership data in the MongoDB database.
 * It tracks which users belong to which organizations and their roles within those organizations.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizationMemberSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  organizationId: {
    type: String,
    required: true,
    ref: 'Organization'
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  role: {
    type: String,
    enum: ['admin', 'member', 'viewer'],
    default: 'member'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  invitedBy: {
    type: String,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: 'organizationMembers'
});

// Indexes for performance optimization
OrganizationMemberSchema.index({ organizationId: 1 });
OrganizationMemberSchema.index({ userId: 1 });
OrganizationMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });
OrganizationMemberSchema.index({ organizationId: 1, role: 1 });

module.exports = mongoose.model('OrganizationMember', OrganizationMemberSchema);

