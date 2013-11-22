'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('ResetPassword', ['$scope', 'Password', '$log', 'notificationsStorage',
        function ($scope, Password, $log, notificationsStorage) {

            $scope.password = new Password({
                text: '',
                confirmation: ''
            });

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
                        notificationsStorage.add('danger', 'Server can not generate password.');
                        $scope.disableInputs = false;
                    }
                );
            };

            $scope.disableEnable = function () {
                $scope.disableInputs = !$scope.disableInputs;
            }

            $scope.generatePassword = function ($event) {
                $scope.isPasswordsShown = false;
                $scope.disableInputs = true;

                Password.generate().then(
                    function (password) {
                        $scope.password.text = password.Text;
                        $scope.password.confirmation = password.Text;
                        $scope.isPasswordsShown = true;
                        $scope.disableInputs = false;
                        $scope.form.$setDirty();
                        notificationsStorage.add('success', 'New password generated');
                    },
                    function (message) {
                        notificationsStorage.add('danger', 'Server can not reset password.');
                        $scope.disableInputs = false;
                    }
                );

                $event.preventDefault();

            };

        }])
    .controller('About', ['$scope', function ($scope) {
    }]);