'use strict';

var user  = require('../modules/user');

exports.init = function (router) {
    router.route('/user/:id')
        .get(user.get);

    router.route('/user')
        .post(user.create);

    router.route('/user/:id')
        .put(user.update);

    router.route('/user/:id')
        .delete(user.remove);

    router.route('/user/:id')
        .get(user.get);
};
