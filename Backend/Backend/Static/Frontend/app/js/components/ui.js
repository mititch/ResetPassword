'use strict';

/**
 * Created by mititch on 26.11.13.
 */

angular.module('myApp.components.ui', [])

    // Saves applications notifications
    // Provide access to add and remove operations
    // Configures with notification template url
    .provider('ui', function () {

        var self = this;

        // Templates URL storage
        self.templates = {};

        // Setup ui provider
        // configurationObject - hash object to configure ui templates
        //      "key" - represents directive name
        //      "value" - represents template URL
        self.initialize = function (configurationObject) {
            angular.extend(self.templates, configurationObject)
        };

        this.$get = ['$templateCache', function ($templateCache) {

            return {
                // Returns a template URL for specified key
                getTemplateUrl: function (key) {
                    return self.templates[key];
                }
            };
        }];

    })

    // Custom input
    // Can show a password in open or hidden mode
    .directive('uiPasswordInput', ['$log', 'ui',
        function ($log, ui) {

            var configurationObject = {
                require: '?ngModel',
                restrict: "E",
                replace: true,
                scope: {
                    showInput: '&',
                    ngModel : '=',
                    disableInputs: '=ngDisabled'
                },
                link: function (scope, element, attrs, ngModelCtrl) {

                    // Save the inner input data as object field
                    // Important for ng-if scope inheritance
                    scope.data = {};

                    // Shows of hides inputs text
                    scope.toggle = false;

                    // Switch the inputs text demonstration mode
                    scope.toggleInput = function () {
                        scope.toggle = !scope.toggle;
                    };

                    // Add watcher for switch the demonstration mode from outside scope
                    if (attrs.showInput) {
                        scope.$watch(
                            function () {
                                // If outside value changed
                                return scope.showInput();
                            },
                            function (value) {
                                // Apply changes
                                scope.toggle = value;
                            }
                        );
                    }

                    if (ngModelCtrl) {

                        // Watch when the input element changes the value
                        scope.$watch('data.innerInputModel', function (value, oldValue) {

                            // Angular ng-model behavior fix
                            // set $dirty if model changed outside input
                            // prevent $dirty set for model from first update
                            if (value != oldValue) {
                                // Update ng-model value
                                ngModelCtrl.$setViewValue(value);
                            }
                        });

                        // Update inner model then render called
                        ngModelCtrl.$render = function () {

                            scope.data.innerInputModel = ngModelCtrl.$viewValue;

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
    )
    // Wrap input with styling and validation elements (uses transclusion)
    // Creates a new scope
    .directive('uiFormFieldWrapper', ['$log', 'ui',
        function ($log, ui) {

            // Parses attribute text to JS object
            var parseAttributeData = function (data) {
                // FIX: angular.fromJson works only with double quotes
                return angular.fromJson(data.replace(/'/g, '\"'));
            }

            var configurationObject =  {
                restrict: 'A',
                require : '^form',
                transclude: true,
                replace: true,
                scope: {
                    validationData: '@',
                    formatData : '@',
                    labelText: '@'
                },
                compile: function (tElement, tAttrs) {

                    return function (scope, element, attrs, formCtrl) {

                        // Get field name
                        // It is possible to get name from transcluded input
                        // but it can effect execution performance
                        var fieldName = attrs.uiFormFieldWrapper;

                        // Check field validation
                        scope.isFieldInvalid = function () {

                            return formCtrl[fieldName].$dirty && formCtrl[fieldName].$invalid;
                        };

                        // Check specified validator fail
                        scope.isValidatorFail = function (key) {

                            return formCtrl[fieldName].$error[key];
                        };

                        // Prepare validators data for repeater
                        scope.validation = function () {

                            return parseAttributeData(scope.validationData);
                        };

                        // Prepare format data
                        scope.format = function () {

                            return parseAttributeData(scope.formatData);
                        };

                    }
                }
            }

            // Get custom template URL
            var templateUrl = ui.getTemplateUrl('uiFormFieldWrapper');

            if (templateUrl) {
                // Use custom template
                configurationObject.templateUrl = templateUrl;
            } else {
                // Use default template
                configurationObject.template = '<div class="form-group">' +
                    '<label class="control-label col-sm-{{format().offset}}">{{labelText}}</label>' +
                    '<div class="col-sm-{{format().size}}" ng-transclude>' +
                    '</div>' +
                    '<div class="col-sm-offset-{{format().offset}} col-sm-{{format().size}}"' +
                    'ng-show="isFieldInvalid()">' +
                    '<span ng-repeat="(key, message) in validation()" ' +
                    'class="text-danger" ng-show="isValidatorFail(key)">' +
                    '{{message}}' +
                    '</span>' +
                    '</div>' +
                    '</div>';
            }

            return configurationObject;

        }]
    )
;
