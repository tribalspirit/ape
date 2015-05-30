'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var archives = require('../../app/controllers/archives.server.controller');

	// Archives Routes
	app.route('/archives')
		.get(archives.list)
		.post(users.requiresLogin, archives.create);

	app.route('/archives/:archiveId')
		.get(archives.read)
		.put(users.requiresLogin, archives.hasAuthorization, archives.update)
		.delete(users.requiresLogin, archives.hasAuthorization, archives.delete);

	// Finish by binding the Archive middleware
	app.param('archiveId', archives.archiveByID);
};
