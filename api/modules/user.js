'use strict';

var mongoose  = require('mongoose');
var User     = require('../models/user');

function toPoco(entity) {
    if (!entity)
        return null;

    return {
        id: entity.id,
        firstName: entity.firstName,
        lastName: entity.lastName,
        email: entity.email
    };
}

exports.get = function(req, res) {
    User.findById(req.params.id, function(err, user){
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.json(toPoco(user));
    });
};

exports.create = function(req, res) {

    var user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.token = req.body.token;

    if (req.body.lon && req.body.lat) {
        user.defLoc = [req.body.lon, req.body.lat];
    }

    user.save(function (err, result) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.json(toPoco(result));
    });
};

exports.update = function(req, res) {
    User.findById(req.params.id, function(err, user){
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (!User){
            res.send(404, "User not found.");
            return;
        }

        user.firstName = req.body.firstName;
        user.lasttName = req.body.lasttName;

        if (req.body.lon && req.body.lat) {
            user.defLoc = [req.body.lon, req.body.lat];
        }

        user.save(function (err, result) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.json(toPoco(result));
        });
    });
};

exports.remove = function(req, res) {
    User.findById(req.params.id, function(err, user){
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (user){
            user.remove(function(err){
                if (err) {
                    res.status(500).send(err);
                    return;
                }

                res.send(200,'');
            });
        }  else  {
            res.send(404, 'User not found.');
        }
    });
};
