'use strict';

var event  = require('../modules/event');

exports.init = function (router) {
    // GET :id
    router.route('/event/:id')
        .get(event.get);

    // POST
    router.route('/event')
        .post(event.create);

    // PUT
    router.route('/event/:id')
        .put(event.update);

    // DELETE
    router.route('/event/:id')
        .delete(event.remove);


    // GET :lon :lat :name :tags :start :end
    // GET lon=&lat=&name=&tags=,&start=&end=
    router.route('/event*')
        .get(event.searchNearby);

    router.route('/subscription/event*')
        .get(event.searchSubscription);

    router.route('/tenant/event*')
        .get(event.searchTenant);

    router.route('/event/:id/register')
        .post(event.register);

    router.route('/event/:id/unregister')
        .post(event.unregister);

    router.route('/event/:id/attend')
        .post(event.attend);
};