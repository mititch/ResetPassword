'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', ['$scope', function($scope) {
        $scope.textLine = 'some text';
        $scope.isPasswordsShown = false;
  }])
  .controller('MyCtrl2', [function() {

  }]);