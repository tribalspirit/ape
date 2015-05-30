'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Archive = mongoose.model('Archive'),
	_ = require('lodash');

/**
 * Create a Archive
 */
exports.create = function(req, res) {
	var archive = new Archive(req.body);
	archive.user = req.user;

	archive.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(archive);
		}
	});
};

/**
 * Show the current Archive
 */
exports.read = function(req, res) {
	res.jsonp(req.archive);
};

/**
 * Update a Archive
 */
exports.update = function(req, res) {
	var archive = req.archive ;

	archive = _.extend(archive , req.body);

	archive.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(archive);
		}
	});
};

/**
 * Delete an Archive
 */
exports.delete = function(req, res) {
	var archive = req.archive ;

	archive.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(archive);
		}
	});
};

/**
 * List of Archives
 */
exports.list = function(req, res) { 
	Archive.find().sort('-created').populate('user', 'displayName').exec(function(err, archives) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(archives);
		}
	});
};

/**
 * Archive middleware
 */
exports.archiveByID = function(req, res, next, id) { 
	Archive.findById(id).populate('user', 'displayName').exec(function(err, archive) {
		if (err) return next(err);
		if (! archive) return next(new Error('Failed to load Archive ' + id));
		req.archive = archive ;
		next();
	});
};

/**
 * Archive authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.archive.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
