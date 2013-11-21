'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('ResetPassword', ['$scope', function($scope) {

        $scope.password = {
            text : '',
            confirmation : ''
        };

        $scope.isPasswordsShown = false;

        $scope.saveChanges = function () {
            $scope.password.done = true;
        };

        $scope.generatePassword = function ($event) {
            $scope.isPasswordsShown = false;

            $event.preventDefault();
            $scope.isPasswordsShown = true;
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