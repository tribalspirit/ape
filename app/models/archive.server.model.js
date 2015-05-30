'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Archive Schema
 */
var ArchiveSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Archive name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Archive', ArchiveSchema);