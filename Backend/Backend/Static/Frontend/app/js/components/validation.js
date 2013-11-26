'use strict';

/**
 * Created by mititch on 26.11.13.
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
                    if (ngModelCtrl) {

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
            }
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
                    if (ngModelCtrl) {

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
            }
        }]
    )
;