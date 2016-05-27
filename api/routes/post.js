'use strict';

var event  = require('../modules/post');

exports.init = function (router) {
    // GET :id
    router.route('/post/:id')
        .get(post.get);

    // POST
    router.route('/post')
        .post(post.create);

    // PUT
    router.route('/post/:id')
        .put(post.update);

    // DELETE
    router.route('/post/:id')
        .delete(post.remove);


    // GET
    router.route('/post*')
        .get(post.getPosts);

};
