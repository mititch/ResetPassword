'use strict';

/**
 *  Set of directives which can be used in the input validation process
 *
 *  The 'min-length' directive can be used to validate the text input value minimal length
 *      Usage: <input type="text" min-length="minValue">
 *          minValue : integer - validation fails if input value length more then specified
 *
 *  The 'equals' directive can be used to validate the input value equals with other one
 *      Usage: <input equals="expression">
 *          expression : string - an Angular expression (or simple text) with which should
 *          be made comparing
 *
 */

angular.module('myApp.components.validation', [])
    // Add min length validation for the input element
    .directive('minLength', ['$log',
        function ($log) {
            return {
                require: '?ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ngModelCtrl) {

                    // If ng-model exist
                    if (ngModelCtrl)
                    {
                        // Add parser and formatter for value in pipeline
                        ngModelCtrl.$parsers.push(function (viewValue) {
                            validateMinLength(viewValue, null);
                            return viewValue;
                        });

                        ngModelCtrl.$formatters.push(function (value) {
                            validateMinLength(value, null);
                            return value;
                        });

                        // Observe the other value
                        attrs.$observe('minLength', function (value) {
                            validateMinLength(null, value);
                        });

                        var validateMinLength = function (innerValue, minLengthAttr) {

                            var value = innerValue || ngModelCtrl.$viewValue || '';
                            var length = minLengthAttr || attrs.minLength;

                            // set validity
                            ngModelCtrl.$setValidity('minLength', value.length >= length);
                        };
                    }
                }
            };
        }]
    )
    // Add equals validation for the input element
    .directive('equals', ['$log',
        function ($log) {
            return {
                require: '?ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ngModelCtrl) {

                    // If ng-model exist
                    if (ngModelCtrl)
                    {
                        // Add parser for this value
                        ngModelCtrl.$parsers.push(function (viewValue) {
                            validateEquals(viewValue, null);
                            return viewValue;
                        });

                        // Add formatter for this value
                        ngModelCtrl.$formatters.push(function (value) {
                            validateEquals(value, null);
                            return value;
                        });

                        // Observe the other value
                        attrs.$observe('equals', function (val) {
                            validateEquals(null, val);
                        });

                        var validateEquals = function (innerValue, outerValue) {

                            var val1 = innerValue || ngModelCtrl.$viewValue;
                            var val2 = outerValue || attrs.equals;

                            // set validity
                            ngModelCtrl.$setValidity('equals', val1 === val2);
                        };
                    }
                }
            };
        }]
    );