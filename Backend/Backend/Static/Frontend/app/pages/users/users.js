'use strict';

/**
 * Configures 'resetPassword' page route and provide the page controller
 */

angular.module('myApp.pages.users', [])

    .config(['$routeProvider',
        function ($routeProvider) {

            // Configure route for this page
            $routeProvider.when('/users', {
                templateUrl: 'pages/users/users.html',
                controller: 'usersPage',
                resolve : {
                    users: ['User', function ( User ) {
                        return User.query();
                    }]
                }
            });
        }
    ])

    /* Page controller*/
    .controller('usersPage', ['$scope', 'users',
        function ($scope, users) {
            $scope.users = users;
        }
    ]);