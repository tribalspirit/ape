'use strict';

//Archives service used to communicate Archives REST endpoints
angular.module('archives').factory('Archives', ['$resource',
	function($resource) {
		return $resource('archives/:archiveId', { archiveId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);