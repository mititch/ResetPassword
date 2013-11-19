'use strict';

/* Directives */


angular.module('myApp.directives', []).
    directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
        elm.text(version);
        };
    }])
    .directive('passwordInput', ['$log',
        function ($log) {

            var formatter = function(value) {
                if (value) {
                    return value.toUpperCase();
                }
            }
            return {
                require : 'ngModel',
                restrict: 'C',
                link : function (scope, element, attrs, ngModelCtrl) {
                    ngModelCtrl.$formatters.push(formatter);
                    ngModelCtrl.$parsers.push(formatter);
                    /*ngModelCtrl.$render = function () {
                        element.attr('value' ,'0' + ngModelCtrl.$viewValue);
                    };*/
                }
            }
        }]
    )
    .directive('passwordWrapper', ['$log',
        function ($log) {
            return {
                //require : '?ngModel',
                template : '<div>' +
                    '<!--div ng-transclude=""></div-->' +
                    '<button ng-click="toggleInput()">{{buttonTitle}}</button>' +
                    '</div>',
                transclude : 'element',
                priority: 500,
                replace: true,
                scope : {
                  show : '='
                },
                compile : function (tElement, tAttrs, trancludeLinkFn){

                    return function (scope, element, attrs, ngModelCtrl) {
                        var inputElement = trancludeLinkFn(scope.$parent, function (clone) {
                        });

                        scope.toggle = false;

                        scope.toggleInput = function(){
                            scope.toggle = !scope.toggle;
                        };

                        scope.$watch('show', function(value) {
                            scope.toggle = value;
                        });

                        scope.$watch('toggle', function(value) {
                            if (value) {
                                inputElement.attr('type', 'text');
                                scope.buttonTitle = 'Hide';
                            } else {
                                inputElement.attr('type', 'password');
                                scope.buttonTitle = 'Show';
                            }
                        });

                        element.append(inputElement);



                    }
                }
            }
        }]
    );
