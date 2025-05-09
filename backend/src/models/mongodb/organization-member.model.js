/**
 * OrganizationMember Model
 * 
 * This file exports the Mongoose model for the OrganizationMember collection.
 */

const mongoose = require('mongoose');
const OrganizationMemberSchema = require('../../schemas/mongodb/organization-members.schema');

module.exports = mongoose.model('OrganizationMember', OrganizationMemberSchema);

