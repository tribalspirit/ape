'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users', 'lodash',
    function ($scope, $stateParams, $location, Authentication, Users, lodash) {
        $scope.authentication = Authentication;

        var roles = ['user', 'editor', 'admin'];

        $scope.selectedRole = '';

        $scope.availableRoles = [];


        $scope.addRole = function (role) {
            $scope.user.roles.push(role);
        };

        $scope.removeRole = function(index){
            $scope.user.roles.splice(index, 1);
        };

        $scope.create = function () {
            var user = new Users({
                firstName: this.firstName,
                lastName: this.lastName,
                displayName: this.displayName,
                email: this.email,
                role: this.role

            });

            user.$save(function (response) {
                $location.path('users/' + response._id);

                $scope.title = '';
                $scope.content = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function (user) {
            if (user) {
                user.$remove();

                for (var i in $scope.users) {
                    if ($scope.users[i] === user) {
                        $scope.users.splice(i, 1);
                    }
                }
            } else {
                $scope.user.$remove(function () {
                    $location.path('users');
                });
            }
        };

        $scope.update = function () {
            var user = $scope.user;

            user.$update(function () {
                $location.path('users/' + user._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function () {
            $scope.users = Users.query();
        };

        $scope.findOne = function () {
            $scope.user = Users.get({
                userId: $stateParams.userId
            });


        };

        $scope.$watch('user.roles', function(newVal, oldVal){
            $scope.availableRoles = lodash.difference(roles, $scope.user.roles);
            $scope.selectedRole = $scope.availableRoles[0];

        }, true);
    }
]);
