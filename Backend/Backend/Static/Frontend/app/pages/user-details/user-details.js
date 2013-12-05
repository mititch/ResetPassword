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
                    user: ['$route', 'User', '$q', function ($route, User, $q) {

                        var defered = $q.defer();
                        var user = User.get({ Id: $route.current.params.id }, function () {
                            // Resolve a promise when the data is received
                            defered.resolve(user);
                        })
                        return defered.promise;
                    }]
                }
            });
        }
    ])

    /* Page controller*/
    .controller('userDetailsPage', ['$scope', 'user', 'Password', 'notificationsStorage', '$route',
        function ($scope, user, Password, notificationsStorage) {

            $scope.user = user;
            // Now user data is received
            $scope.password = new Password(user.Id);

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