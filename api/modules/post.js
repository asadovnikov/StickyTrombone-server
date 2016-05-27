'use strict';

var mongoose     = require('mongoose');
var Post        = require('../models/post');
var Tenant       = require('../models/tenant');
var User         = require('../models/user');
var PostPicture = require('../models/postPicture');

function toPoco(post) {
    if (!post)
        return null;

    return {
        id: post.id,
        description: post.description,
        created: post.created,
        picture: post.picture,
        ownerId: post.ownerId,
        stateId: post.stateId
    };
}

exports.get = function(req, res) {
    Post.findById(req.params.id, function(err, post){
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.json(toPoco(post));
    });
};

exports.create = function(req, res) {

    if (!req.tenantId){
        throw new Error('Not tenant.');
    }

    var post = new Post();
    post.tenant = req.tenantId;
    post.description = req.body.description;
    post.picture = req.body.picture || '';
    post.created = req.body.created;
    post.ownerId = req.body.ownerId;
    post.stateId = req.body.stateId;

    if (req.body.pictureData) {
      var picData = new PostPicture();

      picData.data = req.body.pictureData;
      picData.save(function(err, result){
        if (err) {
          res.status(500).send(err);
          return;
        }

        var picUrl = '/image/'+result.id;
        post.picture = picUrl;

        post.save(function (err, result) {
          if (err) {
            res.status(500).send(err);
            return;
          }

          res.json(toPoco(result));
        });
      });
    }
};

exports.update = function(req, res) {
    Post.findById(req.params.id, function(err, event){
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (!event){
            res.send(404, "Post not found.");
            return;
        }

        post.tenant = req.tenantId;
        post.description = req.body.description;
        post.picture = req.body.picture || '';
        post.created = req.body.created;
        post.ownerId = req.body.ownerId;
        post.stateId = req.body.stateId;

        if (req.body.pictureData){
            var picData = new PostPicture();
            picData.data = req.body.pictureData;

            picData.save(function(err, result) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }

                var picUrl = '/image/'+result.id;
                event.picture = picUrl;

                event.save(function (err, result) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }

                    res.json(toPoco(result));
                });
            });
        } else {
            event.save(function (err, result) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }

                res.json(toPoco(result));
            });
        }
    });
};

exports.remove = function(req, res) {
    Post.findById(req.params.id, function(err, post){
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (post){
            post.remove(function(err){
                if (err) {
                    res.status(500).send(err);
                    return;
                }

                res.send(200,'');
            });
        }  else  {
            res.send(404, 'Post not found.');
        }
    });
};

exports.changeState = function(req, res) {
    if (!req.body.postId){
        throw new Error('postId is null.');
    }

    Post.findById(req.body.postId, function(err, post){
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (!post){
            throw new Error('Post not found,');
        }

        post.stateId = req.body.stateId;

        post.save(function(err){
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.status(200).json({});
        });
    });
};

exports.getPosts = function(req, res) {
  var limit = 100; //for testing purpose
  var query = {tenant : req.query.tenant};
  Post
    .find(query)
    .limit(limit)
    .exec(function(err, posts) {
      if (err)
        return res.status(500).json(err);
      posts = posts || [];

      console.log(posts.length + ' posts found.');
      res.status(200).json(posts.map(toPoco));
    });

};

exports.getPictureData = function(req, res) {

    PostPicture.findById(req.params.id, function(err, picData){
        if (err) {
            res.status(500).send(err);
            return;
        }

        var index = picData.data.indexOf("base64,");
        index = index == -1 ? 0 : index + 7;
        var base64clean = picData.data.substring(index);
        res.send(new Buffer(base64clean, 'base64'));
    });
};
