'use strict';

/**
 * Configures 'resetPassword' page route and provide the page controller
 */

angular.module('myApp.pages.resetPassword', ['myApp.components.resetPassword'])

    .config(['$routeProvider',
        function ($routeProvider) {

            // Configure route for this page
            $routeProvider.when('/resetPassword', {
                templateUrl: 'pages/resetPassword/resetPassword.html',
                controller: 'ResetPasswordPage'
            });
        }
    ])

    /* Page controller*/
    .controller('ResetPasswordPage', ['$scope',
        function ($scope) {
            $scope.password = 'qwerty';
        }
    ]);