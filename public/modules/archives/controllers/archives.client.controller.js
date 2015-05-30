'use strict';

// Archives controller
angular.module('archives').controller('ArchivesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Archives',
	function($scope, $stateParams, $location, Authentication, Archives) {
		$scope.authentication = Authentication;

		// Create new Archive
		$scope.create = function() {
			// Create new Archive object
			var archive = new Archives ({
				name: this.name
			});

			// Redirect after save
			archive.$save(function(response) {
				$location.path('archives/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Archive
		$scope.remove = function(archive) {
			if ( archive ) { 
				archive.$remove();

				for (var i in $scope.archives) {
					if ($scope.archives [i] === archive) {
						$scope.archives.splice(i, 1);
					}
				}
			} else {
				$scope.archive.$remove(function() {
					$location.path('archives');
				});
			}
		};

		// Update existing Archive
		$scope.update = function() {
			var archive = $scope.archive;

			archive.$update(function() {
				$location.path('archives/' + archive._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Archives
		$scope.find = function() {
			$scope.archives = Archives.query();
		};

		// Find existing Archive
		$scope.findOne = function() {
			$scope.archive = Archives.get({ 
				archiveId: $stateParams.archiveId
			});
		};
	}
]);