'use strict';

/**
 * Configures 'resetPassword' page route and provide the page controller
 */

angular.module('myApp.pages.userDetails', [])

    .config(['$routeProvider',
        function ($routeProvider) {

            // Configure route for this page
            $routeProvider.when('/user/:id/details', {
                templateUrl: 'pages/user-details/user-details.html',
                controller: 'userDetailsPage',
                resolve: {

                    user: ['$route', 'User', function ($route, User) {
                        return User.get({ Id: $route.current.params.id });
                    }]
                }
            });
        }
    ])

    /* Page controller*/
    .controller('userDetailsPage', ['$scope', 'user', 'Password', 'notificationsStorage',
        function ($scope, user, Password, notificationsStorage) {
            $scope.user = user;

            // TODO translate
            // View will not generated while the promise not resolved
            // but controller will invoked
            user.$promise.then(function (data) {
                // Create empty password
                $scope.password = new Password(data.Id);
            });

            // Requests a server to save the password update
            $scope.applyChanges = function () {

                // Call to server API with some specific server data
                $scope.password.$update().then(
                    function () {
                        // Set form to pristine state
                        $scope.form.$setPristine();
                        // Notify user
                        notificationsStorage.add('success',
                            'Password is changed.');
                    },
                    function () {
                        // Notify user
                        notificationsStorage.add('danger',
                            'Server can not reset password.');
                    }
                );
            };
        }
    ]);