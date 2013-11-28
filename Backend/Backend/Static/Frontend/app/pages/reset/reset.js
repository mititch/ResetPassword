'use strict';

/**
 * Created by mititch on 26.11.13.
 */

angular.module('myApp.pages.reset', ['myApp.components.resetPassword'])
    .config(['$routeProvider', function ($routeProvider) {
        // Configure route for this page
        $routeProvider.when('/reset', {
            templateUrl: 'pages/reset/reset.html',
            controller: 'ResetPage'
        });
    }])
    .config(['resetPasswordProvider', function (resetPasswordProvider) {
            // Setup resetPassword API url and resetPassword dialog template URL
            resetPasswordProvider.initialize('http://localhost:5869/api/password', 'templates/reset-password/dialog.tpl.html');
        }
    ])
    .controller('ResetPage', ['$scope', 'resetPassword',  function ($scope, resetPassword) {

        $scope.itemsArray = [
            { password : 'qwerty' },
            { password : 'asdfgh' },
            { password : 'zxcvbn' },
        ];

        $scope.resetPasswordAction = function (index) {

            // Call to resetPassword service
            resetPassword.reset($scope).then(
                function (result) {
                    // On success update password value
                    $scope.itemsArray[index].password = result;
                }
            );
        }
    }])
;