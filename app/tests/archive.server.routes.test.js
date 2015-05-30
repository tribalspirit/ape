'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Archive = mongoose.model('Archive'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, archive;

/**
 * Archive routes tests
 */
describe('Archive CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Archive
		user.save(function() {
			archive = {
				name: 'Archive Name'
			};

			done();
		});
	});

	it('should be able to save Archive instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Archive
				agent.post('/archives')
					.send(archive)
					.expect(200)
					.end(function(archiveSaveErr, archiveSaveRes) {
						// Handle Archive save error
						if (archiveSaveErr) done(archiveSaveErr);

						// Get a list of Archives
						agent.get('/archives')
							.end(function(archivesGetErr, archivesGetRes) {
								// Handle Archive save error
								if (archivesGetErr) done(archivesGetErr);

								// Get Archives list
								var archives = archivesGetRes.body;

								// Set assertions
								(archives[0].user._id).should.equal(userId);
								(archives[0].name).should.match('Archive Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Archive instance if not logged in', function(done) {
		agent.post('/archives')
			.send(archive)
			.expect(401)
			.end(function(archiveSaveErr, archiveSaveRes) {
				// Call the assertion callback
				done(archiveSaveErr);
			});
	});

	it('should not be able to save Archive instance if no name is provided', function(done) {
		// Invalidate name field
		archive.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Archive
				agent.post('/archives')
					.send(archive)
					.expect(400)
					.end(function(archiveSaveErr, archiveSaveRes) {
						// Set message assertion
						(archiveSaveRes.body.message).should.match('Please fill Archive name');
						
						// Handle Archive save error
						done(archiveSaveErr);
					});
			});
	});

	it('should be able to update Archive instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Archive
				agent.post('/archives')
					.send(archive)
					.expect(200)
					.end(function(archiveSaveErr, archiveSaveRes) {
						// Handle Archive save error
						if (archiveSaveErr) done(archiveSaveErr);

						// Update Archive name
						archive.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Archive
						agent.put('/archives/' + archiveSaveRes.body._id)
							.send(archive)
							.expect(200)
							.end(function(archiveUpdateErr, archiveUpdateRes) {
								// Handle Archive update error
								if (archiveUpdateErr) done(archiveUpdateErr);

								// Set assertions
								(archiveUpdateRes.body._id).should.equal(archiveSaveRes.body._id);
								(archiveUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Archives if not signed in', function(done) {
		// Create new Archive model instance
		var archiveObj = new Archive(archive);

		// Save the Archive
		archiveObj.save(function() {
			// Request Archives
			request(app).get('/archives')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Archive if not signed in', function(done) {
		// Create new Archive model instance
		var archiveObj = new Archive(archive);

		// Save the Archive
		archiveObj.save(function() {
			request(app).get('/archives/' + archiveObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', archive.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Archive instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Archive
				agent.post('/archives')
					.send(archive)
					.expect(200)
					.end(function(archiveSaveErr, archiveSaveRes) {
						// Handle Archive save error
						if (archiveSaveErr) done(archiveSaveErr);

						// Delete existing Archive
						agent.delete('/archives/' + archiveSaveRes.body._id)
							.send(archive)
							.expect(200)
							.end(function(archiveDeleteErr, archiveDeleteRes) {
								// Handle Archive error error
								if (archiveDeleteErr) done(archiveDeleteErr);

								// Set assertions
								(archiveDeleteRes.body._id).should.equal(archiveSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Archive instance if not signed in', function(done) {
		// Set Archive user 
		archive.user = user;

		// Create new Archive model instance
		var archiveObj = new Archive(archive);

		// Save the Archive
		archiveObj.save(function() {
			// Try deleting Archive
			request(app).delete('/archives/' + archiveObj._id)
			.expect(401)
			.end(function(archiveDeleteErr, archiveDeleteRes) {
				// Set message assertion
				(archiveDeleteRes.body.message).should.match('User is not logged in');

				// Handle Archive error error
				done(archiveDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Archive.remove().exec();
		done();
	});
});