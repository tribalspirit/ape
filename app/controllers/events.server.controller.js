'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Conference = mongoose.model('Conference'),
	_ = require('lodash');

/**
 * Create a conference
 */
exports.create = function(req, res) {
	var conference = new Conference(req.body);
	conference.user = req.user;

	conference.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(conference);
		}
	});
};

/**
 * Show the current Event
 */
exports.read = function(req, res) {
	res.jsonp(req.conference);
};

/**
 * Update a Event
 */
exports.update = function(req, res) {
	var conference = req.conference ;

	conference = _.extend(conference , req.body);

	conference.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(conference);
		}
	});
};

/**
 * Delete an Event
 */
exports.delete = function(req, res) {
	var conference = req.conference ;

	conference.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(conference);
		}
	});
};

/**
 * List of Events
 */
exports.list = function(req, res) {
	Conference.find().sort('-created').populate('user', 'displayName').exec(function(err, conferences) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(conferences);
		}
	});
};

/**
 * Event middleware
 */
exports.eventByID = function(req, res, next, id) { 
	Event.findById(id).populate('user', 'displayName').exec(function(err, conference) {
		if (err) return next(err);
		if (! conference) return next(new Error('Failed to load Event ' + id));
		req.conference = conference ;
		next();
	});
};

/**
 * Event authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.conference.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
