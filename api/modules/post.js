'use strict';

var mongoose     = require('mongoose');
var Event        = require('../models/event');
var Tenant       = require('../models/tenant');
var User         = require('../models/user');
var EventPicture = require('../models/eventPicture');

function toPoco(event) {
    if (!event)
        return null;

    return {
        id: event.id,
        name: event.name,
        description: event.description,
        address: event.address,
        start: event.start,
        picture: event.picture,
        cookies: event.cookies,
        end: event.end,
        loc: event.loc,
        tags: event.tags,
        achievements: event.achievements
    };
}

exports.get = function(req, res) {
    Event.findById(req.params.id, function(err, event){
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.json(toPoco(event));
    });
};

exports.create = function(req, res) {

    if (!req.tenantId){
        throw new Error('Not tenant.');
    }

    var event = new Event();
    event.tenant = req.tenantId;
    event.name = req.body.name;
    event.description = req.body.description;
    event.picture = req.body.picture || '';
    event.cookies = req.body.cookies;
    event.start = req.body.start;
    event.end = req.body.end;
    event.tags = req.body.tags;
    event.achievements = req.body.achievements;
    event.address = req.body.address;
    event.loc = req.body.loc;

    if (!req.body.pictureData) {
        event.save(function (err, result) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.json(toPoco(result));
        });

        return;
    }

    var picData = new EventPicture();

    picData.data = req.body.pictureData;
    picData.save(function(err, result){
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
};

exports.update = function(req, res) {
    Event.findById(req.params.id, function(err, event){
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (!event){
            res.send(404, "Event not found.");
            return;
        }

        event.name = req.body.name;
        event.description = req.body.description;
        event.address = req.body.address;
        event.start = req.body.start;
        event.end = req.body.end;
        event.tags = req.body.tags;
        event.address = req.body.address;
        event.picture = req.body.picture;
        event.cookies = req.body.cookies;
        event.achievements = req.body.achievements;
        event.loc = req.body.loc;

        if (req.body.pictureData){
            var picData = new EventPicture();
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
    Event.findById(req.params.id, function(err, event){
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (event){
            event.remove(function(err){
                if (err) {
                    res.status(500).send(err);
                    return;
                }

                res.send(200,'');
            });
        }  else  {
            res.send(404, 'Event not found.');
        }
    });
};

exports.searchNearby = function(req, res) {

    var limit = req.query.limit || 200;
    var maxDistance = req.query.distance || 80;
    var tags = req.query.tags;
    var name = req.query.name;
    var start = req.query.start;
    var end = req.query.end;

    var orBlock = [];

    if (name && name.trim() !== ''){
        orBlock.push({ name: { $regex: ".*" + name + ".*", $options: "-i" } });
    }

    // DATE RANGE
    if (start) {
        if (end){
            orBlock.push({ $and: [{ start: { $gte: new Date(start) } }, { end: { $lte: new Date(end) } }]});
        }
        else {
            orBlock.push({ start: { $gte: new Date(start) } });
        }
    }

    // TAGS clause
    if (tags && tags.length > 0) {
        var cleanTags = tags.split(",").map(function(i){ return i.trim(); });
        var tagOrBlock = [];
        for(var tag in cleanTags){
            tagOrBlock.push({ tags: cleanTags[tag] });
        }

        orBlock.push( { $or: tagOrBlock } );
    }

    maxDistance /= 6371;
    var coords = [];
    coords[0] = req.query.lon;
    coords[1] = req.query.lat;

    var query;
    if (orBlock.length > 0) {
        query = {
            $and: [
                {loc: {$within: {$centerSphere: [coords, maxDistance]}}},
                {$or: orBlock}
            ]
        };
    } else {
        query = {loc: {$within: {$centerSphere: [coords, maxDistance]}}};
    }

    console.log('QUERY: '+ JSON.stringify(query));

    Event
        .find(query)
        .limit(limit)
        .exec(function(err, events) {
            if (err)
                return res.status(500).json(err);
            events = events || [];

            console.log(events.length + ' events found.');
            res.status(200).json(events.map(toPoco));
        });
};

exports.searchSubscription = function(req, res) {
//TODO Max to complete. now just mock
    exports.searchNearby(req, res);
};

exports.searchTenant = function(req, res) {
//TODO Max to complete. now just mock
    exports.searchNearby(req, res);
};

exports.register = function(req, res) {

    if (!req.body.eventId) {
        throw new Error('eventId is null.');
    }

    User.findById(req.visitorId, function(err, user){
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (user) {


            user.subscriptions.push(req.body.eventId);
            user.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }

                res.status(200).json({});
            });

        } else {
            res.status(200).json({});
        }
    });
};

exports.unregister = function(req, res) {
    if (!req.body.eventId){
        throw new Error('eventId is null.');
    }

    User.findById(req.visitorId, function(err, user){
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (!user){
            throw new Error('Visitor not found,');
        }

        for(var i = visitor.subscriptions.length - 1; i >= 0; i--) {
            if(user.subscriptions[i] === req.body.eventId) {
                user.subscriptions = user.subscriptions.splice(i, 1);
                break;
            }
        }

        user.save(function(err){
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.status(200).json({});
        });
    });
};

exports.attend = function(req, res) {
    if (!req.body.eventId){
        throw new Error('eventId is null.');
    }

    User.findById(req.visitorId, function(err, user){
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (!user){
            throw new Error('Visitor not found,');
        }

        for(var i = visitor.subscriptions.length - 1; i >= 0; i--) {
            if(user.subscriptions[i] === req.body.eventId) {
                user.subscriptions = user.subscriptions.splice(i, 1);
                break;
            }
        }

        user.attendances.push(req.body.eventId);
        user.save(function(err){
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.status(200).json({});
        });
    });
};

exports.getPictureData = function(req, res) {

    EventPicture.findById(req.params.id, function(err, picData){
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