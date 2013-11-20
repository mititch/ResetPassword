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
            var passwordButtonElement = angular.element(
                '<span class="input-group-addon"' +
                    ' ng-click="toggleInput()">' +
                    '{{buttonTitle}}' +
                '</span >')

            return {
                //require : '?ngModel',
                restrict : "A",
                template : '<div class="input-group">' +
                '<span class="input-group-btn">'+
                '<button class="btn btn-default" ng-click="toggleInput()">'+
                '<span class="glyphicon" ' +
                    'ng-class="{\'glyphicon-eye-close\': toggle, \'glyphicon-eye-open\': !toggle}">' +
                '</span>'+
                '</button>'+
                '</span>'+
                '</div>',
                transclude : 'element',
                priority: 500,
                replace: true,
                scope : {
                  show : '='
                },
                compile : function (tElement, tAttrs, trancludeLinkFn){

                    //tElement.append(passwordButtonElement);

                    return function (scope, element, attrs, ngModelCtrl) {

                        element.removeAttr('name');

                        var inputElement = trancludeLinkFn(scope.$parent, function (clone) {
                            clone.addClass('form-control');
                            //attr('type','text');
                        });
                        /*var passwordElement = trancludeLinkFn(scope.$parent, function (clone) {
                            clone.attr('type','password');
                        });*/

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
