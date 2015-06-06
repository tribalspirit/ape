'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

/**
 * List of Authors
 */
exports.list = function(req, res) {
    User.find().sort('-created').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};


/**
 * Show the current article
 */
exports.read = function(req, res) {
    res.json(req.user);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
    var user = req.user;

    user = _.extend(user, req.body);

    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(user);
        }
    });
};

/**
 * Delete an user
 */
exports.delete = function(req, res) {
    var user = req.user;

    user.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(user);
        }
    });
};


/**
 * Archive middleware
 */
exports.userByID = function(req, res, next, id) {
    User.findById(id).exec(function(err, user) {
        if (err) return next(err);
        if (! user) return next(new Error('Failed to load User ' + id));
        req.user = user ;
        next();
    });
};
