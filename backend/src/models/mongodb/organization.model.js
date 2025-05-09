/**
 * Organization Model
 * 
 * This file exports the Mongoose model for the Organization collection.
 */

const mongoose = require('mongoose');
const OrganizationSchema = require('../../schemas/mongodb/organizations.schema');

module.exports = mongoose.model('Organization', OrganizationSchema);

