'use strict';

var mongoose  = require('mongoose');
var Tenant    = require('../models/tenant');

function toPoco(tenant) {
    if (!tenant)
        return null;

    return {
        id: tenant.id,
        name: tenant.name
    };
}

exports.get = function(req, res) {
    Tenant.findById(req.params.id, function(err, entity){
        if (err)
            res.send(err);

        res.json(toPoco(entity));
    });
};

exports.create = function(req, res) {

    var entity = new Tenant();
    entity.name = req.body.name;
    entity.ownerId = req.body.ownerId;

    entity.save(function (err, result) {
        if (err)
            res.send(err);

        res.json(toPoco(result));
    });
};

exports.update = function(req, res) {
    Tenant.findById(req.params.id, function(err, entity){
        if (err)
            res.send(err);

        if (!entity){
            res.send(404, "Tenant not found.");
            return;
        }

        entity.name = req.body.name;

        entity.save(function (err, result) {
            if (err)
                res.send(err);

            res.json(toPoco(result));
        });

        res.json(toPoco(entity));
    });
};

exports.remove = function(req, res) {
    Tenant.findById(req.params.id, function(err, tenant){
        if (err)
            req.send(err);

        if (tenant){
            tenant.remove(function(err){
                if (err)
                    res.send(err);

                res.send(200,'');
            });
        }  else  {
            res.send(404, 'Tenant not found.');
        }
    });
};