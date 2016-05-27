var mongoose     = require('mongoose');
var schemas     = require('./schemas');

module.exports = mongoose.model('User', schemas.userSchema);