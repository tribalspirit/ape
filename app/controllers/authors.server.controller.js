'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Author = mongoose.model('Author'),
	_ = require('lodash');

/**
 * Create a Author
 */
exports.create = function(req, res) {
	var author = new Author(req.body);
	author.user = req.user;

	author.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(author);
		}
	});
};

/**
 * Show the current Author
 */
exports.read = function(req, res) {
	res.jsonp(req.author);
};

/**
 * Update a Author
 */
exports.update = function(req, res) {
	var author = req.author ;

	author = _.extend(author , req.body);

	author.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(author);
		}
	});
};

/**
 * Delete an Author
 */
exports.delete = function(req, res) {
	var author = req.author ;

	author.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(author);
		}
	});
};

/**
 * List of Authors
 */
exports.list = function(req, res) { 
	Author.find().sort('-created').populate('user', 'displayName').exec(function(err, authors) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(authors);
		}
	});
};

/**
 * Author middleware
 */
exports.authorByID = function(req, res, next, id) { 
	Author.findById(id).populate('user', 'displayName').exec(function(err, author) {
		if (err) return next(err);
		if (! author) return next(new Error('Failed to load Author ' + id));
		req.author = author ;
		next();
	});
};

/**
 * Author authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.author.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
