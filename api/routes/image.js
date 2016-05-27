'use strict';

var post  = require('../modules/post');

exports.init = function (router) {
    router.route('/image/:id')
        .get(post.getPictureData);
};
