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

        };
  }])
  .controller('About', ['$scope', function($scope){

        $scope.password = {
            text : '',
            confirmation : ''
        };

        $scope.isPasswordsShown = false;

        $scope.saveChanges = function () {

        };
  }]);