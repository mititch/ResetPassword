'use strict';

/**
 * Created by mititch on 26.11.13.
 */

angular.module('myApp.pages.reset', ['myApp.components.resetPassword'])
    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/reset', {
            templateUrl: 'pages/reset/reset.html',
            controller: 'ResetPage'
        });
    }])
    .config(['resetPasswordProvider', function (resetPasswordProvider) {
            // Setup resetPassword API url
            resetPasswordProvider.initialize('UUURRLL');
        }
    ])
    .controller('ResetPage', ['$scope', 'resetPassword',  function ($scope, resetPassword) {

        $scope.someObject = {
            password : 'qwerty'
        };

        $scope.resetPasswordClick = function (passwordText) {
            resetPassword.reset(passwordText);

        }

    }])
;