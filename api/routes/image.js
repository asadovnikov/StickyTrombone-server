'use strict';

var event  = require('../modules/event');

exports.init = function (router) {
    router.route('/image/:id')
        .get(event.getPictureData);
};