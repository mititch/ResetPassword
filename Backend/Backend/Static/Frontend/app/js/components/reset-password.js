'use strict';

/**
 * Created by mititch on 26.11.13.
 */

angular.module('myApp.components.resetPassword', ['ui.bootstrap'])

    // Saves applications notifications
    // Provide access to add and remove operations
    // Configures with notification template url
    .provider('resetPassword', function () {

        var self = this;

        // Setup ui provider
        // apiUrl - ULR to password reset API
        self.initialize = function (apiUrl) {

            self.apiUrl = apiUrl;
        };

        this.$get = ['$templateCache', '$modal', '$rootScope', function ($templateCache, $modal, $rootScope) {

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

            return {

                // Make password reset
                reset: function (passwordText) {

                    var modalInstance = $modal.open({
                        templateUrl: 'templates/reset-password/dialog.tpl.html',
                        //scope : $rootScope,
                        controller: ModalInstanceCtrl,
                        resolve: {
                            data: function () {
                                return passwordText;
                            }
                        }
                    });

                    return modalInstance.result;
                }
            };
        }];

    })

    // Custom input
    // Can show a password in open or hidden mode
    .directive('uiPasswordInputfgvsdbdfgn', ['$log', 'ui',
        function ($log, ui) {

            var configurationObject = {
                require: '?ngModel',
                restrict: "E",
                replace: true,
                scope: {
                    showInput: '&',
                    disableInputs: '=ngDisabled'
                },
                link: function (scope, element, attrs, ngModelCtrl) {

                    // For ng-if scope inheritance
                    // save the inner input data as object field
                    scope.data = {};

                    scope.toggle = false;

                    // Switch the demonstration mode
                    scope.toggleInput = function () {
                        scope.toggle = !scope.toggle;
                    };

                    // Add watcher for switch the demonstration mode from outside scope
                    if (attrs.showInput) {
                        scope.$watch(
                            function () {
                                return scope.showInput();
                            },
                            function (value) {
                                scope.toggle = value;
                            }
                        );
                    }

                    if (ngModelCtrl) {

                        // Track when the input element changes the value
                        scope.$watch('data.innerInputModel', function (value) {
                            // prevent $dirty set for model
                            if (value !== ngModelCtrl.$viewValue) {
                                ngModelCtrl.$setViewValue(value);
                            }
                        });

                        // Track when the outside model changed
                        ngModelCtrl.$render = function () {
                            // prevent $dirty set for model
                            if (ngModelCtrl.$viewValue) {
                                scope.data.innerInputModel = ngModelCtrl.$viewValue;
                            }
                        };
                    }
                }
            }

            // Get custom template URL
            var templateUrl = ui.getTemplateUrl('uiPasswordInput');

            if (templateUrl) {
                // Use custom template
                configurationObject.templateUrl = templateUrl;
            } else {
                // Use default template
                configurationObject.template = '<div class="input-group">' +
                    '<input type="text" class="form-control" ' +
                    'ng-if="toggle" ng-model="data.innerInputModel" ng-disabled="disableInputs">' +
                    '<input type="password" class="form-control" ' +
                    'ng-if="!toggle" ng-model="data.innerInputModel" ng-disabled="disableInputs">' +
                    '<span class="input-group-btn">' +
                    '<button class="btn btn-default" ng-click="toggleInput()" ng-disabled="disableInputs">' +
                    '<span class="glyphicon" ' +
                    'ng-class="{\'glyphicon-eye-close\': toggle, \'glyphicon-eye-open\': !toggle}">' +
                    '</span>' +
                    '</button>' +
                    '</span>' +
                    '</div>';
            }

            return configurationObject;
        }]
    );
