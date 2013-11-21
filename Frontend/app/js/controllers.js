'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('ResetPassword', ['$scope', 'Password', '$log', function($scope, Password, $log) {

        $scope.password = new Password({
            text : '',
            confirmation : ''
        });

        $scope.isPasswordsShown = false;

        $scope.saveChanges = function () {
            $scope.password.$save();
        };

        $scope.generatePassword = function ($event) {
            $scope.isPasswordsShown = false;

            Password.generate().then(
                function(password){
                    $scope.password = password;
                    $scope.isPasswordsShown = true;
                },
                function(message){
                    $log.log('Error ' + message);
                }
            );

            $event.preventDefault();

        };

  }])
  .controller('About', ['$scope', function($scope){

        $scope.password = {
            text : 'sdfsdfsdf',
            confirmation : ''
        };

        $scope.isPasswordsShown = false;

        $scope.saveChanges = function () {
            $scope.password.done = true;
        };

  }]);