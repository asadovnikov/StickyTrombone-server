'use strict';

var subscription  = require('../modules/subscription');

exports.init = function (router) {
    router.route('/subscription')
        .post(subscription.create);
    router.route('/subscription')
        .get(subscription.findAll);
    router.route('/subscription/create')
        .get(subscription.create);
    router.route('/subscription/create')
        .post(subscription.create);
    router.route('/subscription/:id')
        .delete(subscription.delete);

};
