'use strict';

//Setting up route
angular.module('archives').config(['$stateProvider',
	function($stateProvider) {
		// Archives state routing
		$stateProvider.
		state('listArchives', {
			url: '/archives',
			templateUrl: 'modules/archives/views/list-archives.client.view.html'
		}).
		state('createArchive', {
			url: '/archives/create',
			templateUrl: 'modules/archives/views/create-archive.client.view.html'
		}).
		state('viewArchive', {
			url: '/archives/:archiveId',
			templateUrl: 'modules/archives/views/view-archive.client.view.html'
		}).
		state('editArchive', {
			url: '/archives/:archiveId/edit',
			templateUrl: 'modules/archives/views/edit-archive.client.view.html'
		});
	}
]);