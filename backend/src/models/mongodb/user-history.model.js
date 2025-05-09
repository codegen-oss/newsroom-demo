/**
 * UserHistory Model
 * 
 * This file exports the Mongoose model for the UserHistory collection.
 */

const mongoose = require('mongoose');
const UserHistorySchema = require('../../schemas/mongodb/user-history.schema');

module.exports = mongoose.model('UserHistory', UserHistorySchema);

