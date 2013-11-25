'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('ResetPassword', ['$scope', 'Password', '$log', 'notificationsStorage',
        function ($scope, Password, $log, notificationsStorage) {

            $scope.password = new Password();

            $scope.isPasswordsShown = false;
            $scope.disableInputs = false;

            $scope.saveChanges = function () {
                $scope.disableInputs = true;
                $scope.password.$reset().then(
                    function () {
                        notificationsStorage.add('success', 'Password is changed.');
                        $scope.form.$setPristine();
                        $scope.disableInputs = false;
                    },
                    function () {
                        notificationsStorage.add('danger', 'Server can not reset password.');
                        $scope.disableInputs = false;
                    }
                );
            };

            $scope.generatePassword = function ($event) {
                $scope.isPasswordsShown = false;
                $scope.disableInputs = true;

                $scope.password.$generate().then(
                    function () {
                        $scope.isPasswordsShown = true;
                        $scope.disableInputs = false;
                        $scope.form.$setDirty();
                        notificationsStorage.add('success', 'New password generated');
                    },
                    function () {
                        notificationsStorage.add('danger', 'Server can not generate password.');
                        $scope.disableInputs = false;
                    }
                );

                $event.preventDefault();

            };

        }])
    .controller('About', ['$scope', function ($scope) {
    }]);