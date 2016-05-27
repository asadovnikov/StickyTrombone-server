'use strict';

var tenant  = require('../modules/tenant');

exports.init = function (router) {
    router.route('/tenant/:id')
        .get(tenant.get);

    router.route('/tenant')
        .post(tenant.create);

    router.route('/tenant/:id')
        .put(tenant.update);

    router.route('/tenant/:id')
        .delete(tenant.remove);

    router.route('/tenant/:id')
        .delete(tenant.remove);
};