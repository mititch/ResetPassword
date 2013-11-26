'use strict';

/**
 * Created by mititch on 26.11.13.
 */
angular.module('myApp.pages.password', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/reset-password', {
            templateUrl: 'pages/password/password.html',
            controller: 'PasswordPage'
        });
    }])
    .controller('PasswordPage', ['$scope', 'Password', '$log', 'notificationsStorage',
        function ($scope, Password, $log, notificationsStorage) {

            // Create empty instance
            $scope.password = new Password();

            // Setting the hidden password mode for the all password inputs
            $scope.showPasswords = false;

            // Setting the form inputs to active state
            // TODO fix bag with "a" element disabling
            $scope.disableInputs = false;

            // Requesting to save the model
            $scope.saveChanges = function () {
                $scope.disableInputs = true;

                // Call to resource API
                $scope.password.$reset().then(
                    function () {
                        // On success
                        notificationsStorage.add('success', 'Password is changed.');
                        $scope.form.$setPristine();
                        $scope.disableInputs = false;
                    },
                    function () {
                        // On failure
                        notificationsStorage.add('danger', 'Server can not reset password.');
                        $scope.disableInputs = false;
                    }
                );
            };

            // Requesting new password
            $scope.generatePassword = function ($event) {
                $scope.showPasswords = false;
                $scope.disableInputs = true;

                // Call to resource API
                $scope.password.$generate().then(
                    function () {
                        // On success
                        $scope.showPasswords = true;
                        $scope.disableInputs = false;
                        $scope.form.$setDirty();
                        notificationsStorage.add('success', 'New password generated');
                    },
                    function () {
                        // On failure
                        notificationsStorage.add('danger', 'Server can not generate password.');
                        $scope.disableInputs = false;
                    }
                );

                // stop event propagation
                $event.preventDefault();

            };

        }]);