/**
 * UserInterest Model
 * 
 * This file exports the Mongoose model for the UserInterest collection.
 */

const mongoose = require('mongoose');
const UserInterestSchema = require('../../schemas/mongodb/user-interests.schema');

module.exports = mongoose.model('UserInterest', UserInterestSchema);

