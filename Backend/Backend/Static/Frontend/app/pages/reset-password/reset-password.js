'use strict';

/**
 * Configures 'resetPassword' page route and provide the page controller
 */

angular.module('myApp.pages.resetPassword', ['myApp.components.resetPassword'])

    .config(['$routeProvider',
        function ($routeProvider) {

            // Configure route for this page
            $routeProvider.when('/reset-password', {
                templateUrl: 'pages/reset-password/reset-password.html',
                controller: 'resetPasswordPage'
            });
        }
    ])

    /* Page controller*/
    .controller('resetPasswordPage', ['$scope',
        function ($scope) {

            $scope.data = {
                id : 10
            };
            $scope.password = 'qwerty';

        }
    ]);