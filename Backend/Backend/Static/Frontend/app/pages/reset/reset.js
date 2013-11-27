'use strict';

/**
 * Created by mititch on 26.11.13.
 */

angular.module('myApp.pages.reset', ['myApp.components.resetPassword', 'ui.bootstrap' ])
    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/reset', {
            templateUrl: 'pages/reset/reset.html',
            controller: 'ResetPage'
        });
    }])
    .config(['resetPasswordProvider',
        function (resetPasswordProvider) {
            // Setup resetPassword API url
            resetPasswordProvider.initialize('UUURRLL');
        }
    ])
    .controller('ResetPage', ['$scope', 'resetPassword', '$modal', function ($scope, resetPassword, $modal) {

        $scope.someObject = {
            password : 'qwerty'
        };

        $scope.resetPasswordClick = function (passwordText) {
            //resetPassword.reset(passwordText);

            var ModalInstanceCtrl = function ($scope, $modalInstance, data) {

                $scope.data = {

                    password: data

                }

                $scope.ok = function () {
                    $modalInstance.close($scope.data.password);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss();
                };
            };

            var modalInstance = $modal.open({
                templateUrl: 'templates/reset-password/dialog.tpl.html',
                //scope : $rootScope,
                controller: ModalInstanceCtrl,
                resolve: {
                    data: function () {
                        return $scope.someObject.password;
                    }
                }
            });


        }

    }])
;