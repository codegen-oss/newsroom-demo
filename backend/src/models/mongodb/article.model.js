/**
 * Article Model
 * 
 * This file exports the Mongoose model for the Article collection.
 */

const mongoose = require('mongoose');
const ArticleSchema = require('../../schemas/mongodb/articles.schema');

module.exports = mongoose.model('Article', ArticleSchema);

