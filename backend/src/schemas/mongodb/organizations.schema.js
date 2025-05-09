/**
 * MongoDB Schema for Organizations Collection
 * 
 * This schema defines the structure for organization data in the MongoDB database.
 * It includes organization details, subscription information, and billing data.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BillingAddressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String
}, { _id: false });

const PaymentMethodSchema = new Schema({
  type: {
    type: String,
    enum: ['credit_card', 'bank_transfer', 'paypal'],
    default: 'credit_card'
  },
  lastFour: String,
  expiryDate: String,
  holderName: String
}, { _id: false });

const SubscriptionSchema = new Schema({
  plan: {
    type: String,
    required: true
  },
  seats: {
    type: Number,
    default: 1,
    min: 1
  },
  usedSeats: {
    type: Number,
    default: 0,
    min: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  renewalDate: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: PaymentMethodSchema,
    default: () => ({})
  }
}, { _id: false });

const OrganizationSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String
  },
  industry: {
    type: String
  },
  size: {
    type: String
  },
  billingEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  billingAddress: {
    type: BillingAddressSchema,
    default: () => ({})
  },
  subscription: {
    type: SubscriptionSchema,
    required: true
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
  collection: 'organizations'
});

// Indexes for performance optimization
OrganizationSchema.index({ name: 1 });
OrganizationSchema.index({ 'subscription.renewalDate': 1 });
OrganizationSchema.index({ industry: 1 });

module.exports = mongoose.model('Organization', OrganizationSchema);

