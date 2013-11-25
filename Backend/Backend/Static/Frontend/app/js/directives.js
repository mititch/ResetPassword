'use strict';

/* Directives */

angular.module('myApp.directives', [])
    .directive('password', ['$log',
        function ($log) {
            return {
                require: '?ngModel',
                restrict: "E",
                template: '<div class="input-group">' +
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
                    '</div>',
                replace: true,
                scope: {
                    showInput: '=',
                    //TODO : test it
                    disableInputs : '=ngDisabled'
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
                    if (!ngModelCtrl) return; // do nothing if no ng-model

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
        }]
    )

    .directive('equals', ['$log',
        function ($log) {
            return {
                require: '?ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ngModelCtrl) {
                    if (!ngModelCtrl) return; // do nothing if no ng-model

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
        }]
    )
    .directive('fieldWrapper', ['$log',
        function ($log) {

            var divElement = angular.element('<div></div>');
            var labelElement = angular.element('<label></label>');
            var spanElement = angular.element('<span></span>');

            return {
                restrict: 'A',
                priority: 100,
                compile: function (tElement, tAttrs) {
                    // TODO: use transclusion
                    var labelColumns = tAttrs.labelColumns;
                    var fieldColumns = tAttrs.fieldColumns;

                    var fieldFullName = tAttrs.fieldWrapper;
                    var fieldName = tAttrs.fieldWrapper.split('.')[1];

                    tElement.addClass('form-group');

                    tElement.children().wrap(divElement.clone().addClass('col-sm-' + fieldColumns));

                    var validatorsContainer = divElement.clone().
                        addClass('col-sm-offset-' + labelColumns).
                        addClass('col-sm-' + fieldColumns).
                        attr('ng-show', fieldFullName + '.$dirty && ' + fieldFullName + '.$invalid');

                    // add validation
                    var validationData = angular.fromJson(tAttrs.validators.replace(/'/g, '\"'));

                    angular.forEach(validationData, function (value, key) {
                        validatorsContainer.append(spanElement.clone()
                            .addClass('text-danger')
                            .attr('ng-show', fieldFullName + '.$error.' + key)
                            .html(value)
                        );
                    });

                    tElement.prepend(labelElement.clone()
                        .addClass('control-label')
                        .addClass('col-sm-' + labelColumns)
                        .html(tAttrs.labelText)
                    );

                    tElement.append(validatorsContainer);

                    return function (scope, element, attrs, ngModelCtrl) {

                    }
                }
            }
        }]
    )

    .directive('notificationPanel', ['notificationsStorage',
        function (notificationsStorage) {

            return {
                template :
                    '<div>' +
                        '<div ng-repeat="notification in notifications" class="alert alert-{{notification.type}}">' +
                        '{{notification.text}}' +
                        '<button ng-click="removeNotification($index)" ' +
                            'type="button" class="close" aria-hidden="true">&times;</button>' +
                        '</div>' +
                    '</div>',
                restrict: 'EA',
                replace : true,
                link : function (scope) {

                    scope.notifications = notificationsStorage.notifications;

                    scope.removeNotification = function (index) {
                        notificationsStorage.remove(index);
                    };

                }
            }
        }]
    )
;
