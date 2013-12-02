'use strict';

/* jasmine specs for myApp.components.validation module */

describe('myApp.components.validation', function () {
    beforeEach(module('myApp.components.validation'));

    var $rootScope;     //root scope object reference
    var $compile;       //compile function reference
    var validTemplate;    //object with default data
    var defaultData;    //object with default data

    function createDirective(data, template)
    {
        // Setup scope state
        $rootScope.data = data || defaultData;

        // Create directive element
        var element = angular.element(template || validTemplate);

        // Create directive
        $compile(element)($rootScope);

        // Trigger watchers
        $rootScope.$apply();

        // Return
        return element;
    }

    beforeEach(function () {

        // Provide any mocks needed
        module(function ($provide) {
            //$provide.value('Name', new MockName());
        });

        // Inject in angular and module constructs
        inject(function (_$rootScope_, _$compile_) {
            $rootScope = _$rootScope_.$new();
            $compile = _$compile_;
        });

    });

    //
    //  minLength directive
    //

    describe('minLength', function () {

        var DEFAULT_VALUE = 4;

        var DEFAULT_TEMPLATE =
            '<input ng-model="data.textLine" min-length="'+ DEFAULT_VALUE +'"/>';
        var DEFAULT_TEXT_STRING = 'password-string';
        var RIGHT_TEXT_STRING = 'new-password';
        var WRONG_TEXT_STRING = 'pas';

        beforeEach(function () {
            // Reset template
            validTemplate = DEFAULT_TEMPLATE;

            // Reset data each time
            defaultData = {
                textLine: DEFAULT_TEXT_STRING
            };
        });

        describe('when created', function () {

            describe('with right text string', function () {

                it('should be valid', function () {
                    var element = createDirective();
                    return expect(element.hasClass('ng-valid')).toBe(true);

                });

            });

            describe('with wrong text string', function () {

                it('should not be valid', function () {
                    var element = createDirective({ textLine: WRONG_TEXT_STRING});
                    return expect(element.hasClass('ng-invalid')).toBe(true);

                });

            });

        });

        describe('when data changed', function () {

            var element;

            beforeEach(function () {
                element = createDirective();
            });

            describe('with right text string', function () {

                it('should be valid', function () {
                    $rootScope.data.textLine =  RIGHT_TEXT_STRING;
                    $rootScope.$apply();

                    return expect(element.hasClass('ng-valid')).toBe(true);
                });

            });

            describe('with wrong text string', function () {

                it('should not be valid', function () {
                    $rootScope.data.textLine =  WRONG_TEXT_STRING;
                    $rootScope.$apply();

                    return expect(element.hasClass('ng-invalid')).toBe(true);
                });

            });
        });
    });

    //
    //  equals directive
    //

    describe('equals', function () {

        var DEFAULT_VALUE = 4;

        var DEFAULT_TEMPLATE =
            '<input ng-model="data.textLine" equals="{{data.compareLine}}"/>';

        var DEFAULT_TEXT_STRING = 'string';
        var OTHER_TEXT_STRING = 'other password';

        beforeEach(function () {
            // Reset template
            validTemplate = DEFAULT_TEMPLATE;

            // Reset data each time
            defaultData = {
                textLine: DEFAULT_TEXT_STRING,
                compareLine: DEFAULT_TEXT_STRING
            };
        });

        describe('when created', function () {

            describe('with equals text string', function () {

                it('should be valid', function () {
                    var element = createDirective();
                    return expect(element.hasClass('ng-valid')).toBe(true);

                });

            });

            describe('with not equals text string', function () {

                it('should not be valid', function () {
                    var element = createDirective({
                        textLine: OTHER_TEXT_STRING,
                        compareLine: DEFAULT_TEXT_STRING
                    });
                    return expect(element.hasClass('ng-invalid')).toBe(true);

                });

            });

        });

        describe('when data changed', function () {

            var element;

            beforeEach(function () {
                element = createDirective();
            });

            describe('with equals text string', function () {

                it('should be valid', function () {
                    $rootScope.data.textLine =  DEFAULT_TEXT_STRING;
                    $rootScope.$apply();

                    return expect(element.hasClass('ng-valid')).toBe(true);
                });

            });

            describe('with wrong text string', function () {

                it('should not be valid', function () {
                    $rootScope.data.textLine =  OTHER_TEXT_STRING;
                    $rootScope.$apply();

                    return expect(element.hasClass('ng-invalid')).toBe(true);
                });

            });
        });

        describe('when compared data changed', function () {

            var element;

            beforeEach(function () {
                element = createDirective();
            });

            describe('with equals text string', function () {

                it('should be valid', function () {
                    $rootScope.data.compareLine =  DEFAULT_TEXT_STRING;
                    $rootScope.$apply();

                    return expect(element.hasClass('ng-valid')).toBe(true);
                });

            });

            describe('with wrong text string', function () {

                it('should not be valid', function () {
                    $rootScope.data.compareLine =  OTHER_TEXT_STRING;
                    $rootScope.$apply();

                    return expect(element.hasClass('ng-invalid')).toBe(true);
                });

            });
        });
    });
});