'use strict';

/**
 *  Set of directives which can expand user interface
 *
 *  The 'uiProvider' may be used to configure directives templates
 *      Usage: uiProvider.initialize(configurationObject)
 *          configurationObject : object - hash object which contains template URLs
 *              key - represents directive name
 *              value - represents template URL
 *
 *  The 'ui-password-input' directive may be used to show passwords with specific behavior
 *      Usage: <div ui-password-input show-input='showPasswords' ng-model='property'></div>
 *          showPasswords : expression - if expression is truly input shows password as text
 *          property - scope property which represents input value
 *      Overridden the directives template should contain two inputs with 'data.innerInputModel'
 *          property in kind of ng-model value (active input control via 'toggle' property)
 *          and button which should trigger 'showInputs()' method to change 'toggle' value
 *
 *  The 'ui-form-field-wrapper' directive may be used to add specific decoration to form input
 *      and controls of validations messages view
 *      Usage: <div ui-form-field-wrapper="fieldName"
 *                  label-text="labelText"
 *                  format-data="formatData"
 *                  validation-data="validationData"><input name="fieldName"/><div>
 *             fieldName : string - form input name. Should be equals to input tag
 *                  name attribute
 *             labelText : string - text of label. Can bee obtained in
 *                 overridden template through 'labelText' property
 *             formatData : string - in format of JS object which can be used to
 *                 transfer some data into directive template. Can bee obtained in
 *                 overridden template through 'format()' method
 *             validationData : string - in format of JS object which can be used to
 *                 setup validation messages. Keys should contain validator names,
 *                 values should contain validation messages. Can bee obtained in
 *                 overridden template through 'validation()' method
 *      In overridden directives template isDirtyAndInvalid() method can be used to check of input $dirty
 *      and $invalid properties.
 *      Also 'isValidatorFail(key)' method can be used to check specified validator fail.
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
        self.initialize = function (configurationObject) {
            angular.extend(self.templates, configurationObject)
        };

        this.$get = ['$templateCache', function ($templateCache) {

            return {
                // Returns a template URL for specified key (directive name)
                getTemplateUrl: function (key) {
                    return self.templates[key];
                }
            };
        }];

    })

    // Can show a password text in open or hidden mode
    .directive('uiPasswordInput', ['$log', 'ui',
        function ($log, ui) {

            var configurationObject = {
                require: '?ngModel',
                restrict: "EA",
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
                            // sets $dirty if model changed outside input
                            // prevent $dirty set for model during first update
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

            // Try to get custom template URL
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
                        scope.isDirtyAndInvalid = function () {

                            return formCtrl[fieldName].$dirty && formCtrl[fieldName].$invalid;
                        };

                        // Check specified validator fail
                        scope.isValidatorFail = function (key) {

                            return formCtrl[fieldName].$error[key] ;
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
                    'ng-show="isDirtyAndInvalid()">' +
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
