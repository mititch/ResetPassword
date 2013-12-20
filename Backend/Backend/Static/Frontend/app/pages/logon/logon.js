'use strict';

/**
 * Configures 'about' page route and provide the page controller
 */

angular.module('myApp.pages.logon', [])

    .config(['$routeProvider', function ($routeProvider) {
        // Configure route for this page
        $routeProvider.when('/logon', {
            templateUrl: 'pages/logon/logon.html',
            controller: 'logonPage'
        });
    }])

    /* Page controller*/
    .controller('logonPage', ['$scope', '$location', 'CriticalData', 'Auth',
        function ($scope, $location, CriticalData, Auth) {

            $scope.isLoggedIn = Auth.isLoggedIn;
            $scope.isReady = CriticalData.isReady();

            $scope.login = '';
            $scope.password = '';

            var leavePage = function () {
                // TODO : redirect to previous URL
                $location.path('/');
            };

            $scope.logon = function () {
                Auth.logon($scope.login, $scope.password).then(function () {
                    $scope.isLoggedIn = true;
                    if ($scope.isReady) {
                        leavePage();
                    }
                });
            };

            if (!CriticalData.isReady()) {
                CriticalData.reload().then(function () {
                    $scope.isReady = true;
                    if ($scope.isLoggedIn) {
                        leavePage();
                    }
                });
            }

        }
    ]);

