var mongoose     = require('mongoose');
var schemas     = require('./schemas');

module.exports = mongoose.model('Tenant', schemas.tenantSchema);