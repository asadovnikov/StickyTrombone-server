var mongoose     = require('mongoose');
var schemas     = require('./schemas');

module.exports = mongoose.model('Post', schemas.postSchema);
