'use strict';

/**
 * Created by mititch on 26.11.13.
 */

angular.module('myApp.components.ui', [])
    // Custom input
    // Can show a password in open or hidden mode
    .directive('uiPasswordInput', ['$log',
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

        }]
    )
    // Wrap input with styling and validation elements
    // Not creates a new scope
    .directive('uiFormField', ['$log',
        function ($log) {

            var divElement = angular.element('<div></div>');
            var labelElement = angular.element('<label></label>');
            var spanElement = angular.element('<span></span>');

            return {
                restrict: 'A',
                // TODO check this
                priority: 500,
                compile: function (tElement, tAttrs) {
                    var labelColumns = tAttrs.labelColumns;
                    var fieldColumns = tAttrs.fieldColumns;

                    var fieldFullName = tAttrs.uiFormField;
                    var fieldName = tAttrs.uiFormField.split('.')[1];

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
    // Wrap input with styling and validation elements (uses transclusion)
    // Creates a new scope
    .directive('uiTranscludedFormField', ['$log',
        function ($log) {

            var divElement = angular.element('<div></div>');
            var labelElement = angular.element('<label></label>');
            var spanElement = angular.element('<span></span>');

            return {
                restrict: 'A',
                template: '<div class="form-group">' +
                    '<label class="control-label col-sm-{{labelColumns}}">{{labelText}}</label>' +
                    '<div class="col-sm-{{fieldColumns}}" ng-transclude>' +
                    '</div>' +
                    '<div class="col-sm-offset-{{labelColumns}} col-sm-{{fieldColumns}}>" ' +
                    'ng-show="showValidators()">' +
                    '<span ng-repeat="(key, value) in validatorsData()" ' +
                    'class="text-danger" ng-show="showValidator(key)">' +
                    '{{value}}' +
                    '</span>' +
                    '</div>' +
                    '</div>',
                transclude: true,
                replace: true,
                // TODO check this
                priority: 500,
                scope: {
                    labelColumns: '@',
                    fieldColumns: '@',
                    fieldFullName: '@uiTranscludedFormField',
                    validators: '@',
                    labelText: '@'
                },
                compile: function (tElement, tAttrs, transLinkFn) {

                    return function (scope, element, attrs) {

                        // TODO : fix bag with validators margin

                        // Add show validators watch
                        scope.showValidators = function () {
                            return scope.$parent.$eval(scope.fieldFullName + '.$dirty && '
                                + scope.fieldFullName + ' .$invalid');
                        };

                        // Add show validator watch
                        scope.showValidator = function (key) {
                            return scope.$parent.$eval(scope.fieldFullName + '.$error.' + key);
                        }

                        // Prepare validators data for repeater
                        scope.validatorsData = function () {
                            return angular.fromJson(scope.validators.replace(/'/g, '\"'));
                        };
                    }
                }
            }
        }]
    )
;
