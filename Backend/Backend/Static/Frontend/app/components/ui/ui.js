'use strict';

/**
 *  Set of directives which can expand user interface
 *
 *  The 'ui-password-input' directive may be used to show passwords with specific behavior
 *      Usage: <div ui-password-input show-input='showPasswords' ng-model='property'></div>
 *          showPasswords : expression - if expression is truly input shows password as text
 *          property - scope property which represents input value
 *      While overriding the default template, new template should contain two inputs with
 *          'innerModel.value' property in kind of ng-model value
 *          (active input control via 'toggle' property)
 *          and button which should trigger 'toggleInput()' method to change 'toggle' value.
 *
 *  The 'ui-form-field' directive may be used to add specific decoration to form input
 *      and controls of validations messages view
 *      Usage: <div ui-form-field="fieldName"
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
 *      In overridden directives template isDirtyAndInvalid() method can be used to check of input
 *      $dirty and $invalid properties.
 *      Also 'isValidatorFail(key)' method can be used to check specified (by key) validator fail.
 */

angular.module('myApp.components.ui', [])
    // Can show a password text in open or hidden mode
    .directive('uiPasswordInput', ['$log',
        function ($log) {

            return {
                require: '?ngModel',
                restrict: "EA",
                templateUrl: 'components/ui/ui-password-input.tpl.html',
                replace: true,
                scope: {
                    // TODO: discuss '&'
                    showInput: '=',
                    outerModel: '=ngModel',
                    disableInputs: '=ngDisabled'
                },
                link: function (scope, element, attrs, ngModelCtrl) {

                    // Save the inner input value as object field
                    // Important for ng-if scope inheritance
                    scope.innerModel = {};

                    // Shows of hides inputs text
                    scope.toggle = false;

                    // Switch the inputs text demonstration mode
                    scope.toggleInput = function () {
                        scope.toggle = !scope.toggle;
                    };

                    // Add watcher for switch the demonstration mode from outside scope
                    if (attrs.showInput) {
                        scope.$watch('showInput',
                            function (value) {
                                // Apply changes
                                scope.toggle = value;
                            }
                        );
                    }

                    if (ngModelCtrl) {
                        // Watch when the input element changes the value
                        scope.$watch('innerModel.value', function (value, oldValue) {

                            // Angular ng-model behavior fix
                            // sets $dirty if model changed outside input
                            // prevent $dirty set for model during first update
                            if (value != oldValue) {
                                // Update ng-model value
                                ngModelCtrl.$setViewValue(value);
                            }
                        });

                        scope.$watch('outerModel', function (value, oldValue) {

                            // Update inner model
                            scope.innerModel.value = ngModelCtrl.$viewValue;
                        });
                    }
                }
            };
        }]
    )

    // Wrap input with styling and validation elements (uses transclusion)
    // Creates a new scope
    .directive('uiFormField', ['$log',
        function ($log) {
            // Parses attribute text to JS object
            var parseAttributeData = function (data) {
                // FIX: angular.fromJson works only with double quotes
                return angular.fromJson(data.replace(/'/g, '\"'));
            };

            return {
                restrict: 'A',
                templateUrl: 'components/ui/ui-form-field.tpl.html',
                transclude: true,
                replace: true,
                scope: {
                    validationData: '@',
                    formatData: '@',
                    labelText: '@'
                },
                link: function (scope, element, attrs) {

                    // Get nearest form controller
                    var formCtrl = element.controller('form');

                    // Get field name
                    // It is possible to get name from transcluded input
                    // but it can effect execution performance
                    var fieldName = attrs.uiFormField;

                    // Check field validation
                    scope.isDirtyAndInvalid = function () {

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
            };
        }]
    );