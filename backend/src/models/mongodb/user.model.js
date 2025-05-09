/**
 * User Model
 * 
 * This file exports the Mongoose model for the User collection.
 */

const mongoose = require('mongoose');
const UserSchema = require('../../schemas/mongodb/users.schema');

module.exports = mongoose.model('User', UserSchema);

