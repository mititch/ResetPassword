'use strict';

/**
 * Configures 'logon' page route and provide the page controller
 */

angular.module('myApp.pages.logon', [])

    .config(['$routeProvider', function ($routeProvider) {

        // Configure route for this page
        $routeProvider.when('/logon', {
            templateUrl: 'pages/logon/logon.html',
            controller: 'logonPage',
            resolve: {
                backRoute : ['$location', function ($location) {
                    return $location.search()['backRoute'];
                }]
            }
        });

        $routeProvider.when('/logout', {
            template: '<p>Logout...</p>',
            controller: 'logoutPage'
        });
    }])

    .run(['Auth', function (Auth) {
        // Setup logon url
        Auth.logonPath = '/logon';
    }])

    /* Page controller*/
    .controller('logonPage', ['$scope', '$location', 'Initializer', 'Auth', 'backRoute',
        function ($scope, $location, Initializer, Auth, backRoute) {

            $scope.isLoggedIn = Auth.isLoggedIn();
            $scope.isReady = Initializer.isReady();

            $scope.login = '';
            $scope.password = '';

            var leavePage = function () {
                $location.url(backRoute);
            };

            $scope.logon = function () {
                Auth.logon($scope.login, $scope.password).then(function () {
                    $scope.isLoggedIn = true;
                    if ($scope.isReady) {
                        leavePage();
                    }
                });
            };

            if (!Initializer.isReady()) {
                Initializer.whenReady().then(function () {
                    $scope.isReady = true;
                    if ($scope.isLoggedIn) {
                        leavePage();
                    }
                });
            }

        }
    ])

    .controller('logoutPage', ['$scope', '$location', 'Auth',
        function ($scope, $location, Auth) {

            Auth.logout().then(function () {
                $location.path(Auth.logonPath);
            });

        }
    ]);

