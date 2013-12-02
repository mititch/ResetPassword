'use strict';

/**
 * Configures 'passwords' page route and provide the page controller
 */

angular.module('myApp.pages.passwords', ['myApp.components.resetPassword'])

    .config(['$routeProvider', 'resetPasswordProvider',
        function ($routeProvider, resetPasswordProvider) {

            // Configure route for this page
            $routeProvider.when('/passwords', {
                templateUrl: 'pages/passwords/passwords.html',
                controller: 'PasswordsPage'
        });

        // Configure resetPassword service with server API url and dialog template URL
        resetPasswordProvider.initialize(
            'http://localhost:5869/api/password',
            'templates/reset-password/dialog.tpl.html');
    }])

    /* Page controller*/
    .controller('PasswordsPage', ['$scope', 'resetPassword',
        function ($scope, resetPassword) {

            $scope.itemsArray = [
                { id: 1, password : 'qwerty' },
                { id: 2, password : 'asdfgh' },
                { id: 3, password : 'zxcvbn' }
            ];

            $scope.resetPassword = function (index) {

                // Call to resetPassword service with some specific object
                // (in this case with item id)
                resetPassword
                    .open($scope, { id : $scope.itemsArray[index].id })
                    .then(function (result) {
                            // On success update password value of current element
                            $scope.itemsArray[index].password = result;
                        }
                    );
            };
        }
    ]);