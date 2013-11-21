'use strict';

/* Directives */


angular.module('myApp.directives', []).
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .directive('password', ['$log',
        function ($log) {

            return {
                require: '?ngModel',
                restrict: "E",
                template: '<div class="input-group">' +
                    '<input type="text" class="form-control" ng-if="toggle" ng-model="data.innerInputModel">' +
                    '<input type="password" class="form-control" ng-if="!toggle" ng-model="data.innerInputModel">' +
                    '<span class="input-group-btn">' +
                    '<button class="btn btn-default" ng-click="toggleInput()">' +
                    '<span class="glyphicon" ' +
                    'ng-class="{\'glyphicon-eye-close\': toggle, \'glyphicon-eye-open\': !toggle}">' +
                    '</span>' +
                    '</button>' +
                    '</span>' +
                    '</div>',
                replace: true,
                scope: {
                    showInput: '='
                },
                link: function (scope, element, attrs, ngModelCtrl) {

                    // For ng-if scope inheritance
                    scope.data = {};

                    scope.toggle = false;

                    scope.toggleInput = function () {
                        scope.toggle = !scope.toggle;
                    };

                    scope.$watch('showInput', function (value) {
                        scope.toggle = value;
                    });

                    if (ngModelCtrl) {
                        scope.$watch('data.innerInputModel', function (value) {

                            // prevent $dirty set for model
                            if (value !== ngModelCtrl.$viewValue) {
                                ngModelCtrl.$setViewValue(value);
                            }
                        });

                        ngModelCtrl.$render = function () {

                            // prevent $dirty set for model
                            if (ngModelCtrl.$viewValue) {
                                scope.data.innerInputModel = ngModelCtrl.$viewValue;
                            }
                        };
                    }
                }
            }

        }]
    )
    .directive('minLength', ['$log',
        function ($log) {
            return {
                require: '?ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ngModelCtrl) {
                    if(!ngModelCtrl) return; // do nothing if no ng-model

                    // Add parser for this value
                    ngModelCtrl.$parsers.push(function(viewValue) {
                        validateMinLength(viewValue, null);
                        return viewValue;
                    });

                    // Observe the other value
                    attrs.$observe('minLength', function (value) {
                        validateMinLength(null, value);
                    });

                    var validateMinLength = function(innerValue, minLengthAttr) {

                        var value = innerValue || ngModelCtrl.$viewValue || '';
                        var length = minLengthAttr || attrs.minLength;

                        // set validity
                        ngModelCtrl.$setValidity('minLength', value.length >= length);
                    };
                }
            }
        }]
    )
    .directive('equals', ['$log',
        function ($log) {
            return {
                require: '?ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ngModelCtrl) {
                    if(!ngModelCtrl) return; // do nothing if no ng-model

                    // Add parser for this value
                    ngModelCtrl.$parsers.push(function(viewValue) {
                        validateEquals(viewValue, null);
                        return viewValue;
                    });

                    // Observe the other value
                    attrs.$observe('equals', function (val) {
                        validateEquals(null, val);
                    });

                    var validateEquals = function(innerValue, outerValue) {

                        var val1 = innerValue || ngModelCtrl.$viewValue;
                        var val2 = outerValue || attrs.equals;

                        // set validity
                        ngModelCtrl.$setValidity('equals', val1 === val2);
                    };
                }
            }
        }]
    )
    .directive('passwordWrapper', ['$log',
        function ($log) {
            var passwordButtonElement = angular.element(
                '<span class="input-group-addon"' +
                    ' ng-click="toggleInput()">' +
                    '{{buttonTitle}}' +
                    '</span >')

            return {
                require: '?^ngForm',
                restrict: "A",
                template: '<div class="input-group">' +
                    '<span class="input-group-btn">' +
                    '<button class="btn btn-default" ng-click="toggleInput()">' +
                    '<span class="glyphicon" ' +
                    'ng-class="{\'glyphicon-eye-close\': toggle, \'glyphicon-eye-open\': !toggle}">' +
                    '</span>' +
                    '</button>' +
                    '</span>' +
                    '</div>',
                transclude: 'element',
                //priority: 500,
                replace: true,
                //terminal: true,
                scope: {
                    show: '='
                },
                //controller : []
                compile: function (tElement, tAttrs, trancludeLinkFn) {

                    //tElement.append(passwordButtonElement);
//                    tAttrs.removeAttr('name');
                    //tElement.removeAttr('name');
                    //tElement.removeAttr('ng-model');

                    return function (scope, element, attrs, ngFormCtrl) {
                        //element.removeAttr('name');
                        //element.removeAttr('ng-model');

                        var inputElement = trancludeLinkFn(scope.$parent, function (clone) {
                            clone.addClass('form-control');
                        });

                        /*var passwordElement = trancludeLinkFn(scope.$parent, function (clone) {
                         clone.attr('type','password');
                         });*/

                        scope.toggle = false;

                        scope.toggleInput = function () {
                            scope.toggle = !scope.toggle;
                        };

                        scope.$watch('show', function (value) {
                            scope.toggle = value;
                        });

                        scope.$watch('toggle', function (value) {
                            if (value) {
                                inputElement.attr('type', 'text');

                            } else {
                                inputElement.attr('type', 'password');
                            }
                        });

                        element.prepend(inputElement);

                    }
                }
            }
        }]
    );
