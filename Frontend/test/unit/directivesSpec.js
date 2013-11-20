'use strict';

/* jasmine specs for directives go here */

describe('directives', function () {
    beforeEach(module('myApp.directives'));

    describe('app-version', function () {
        it('should print current version', function () {

            module(function ($provide) {
                $provide.value('version', 'TEST_VER');
            });

            inject(function ($compile, $rootScope) {

                var element = $compile('<span app-version></span>')($rootScope);
                expect(element.text()).toEqual('TEST_VER');
            });
        });
    });

    describe('password-wrapper', function () {

        var VALID_TEMPLATE =
            '<input type="text" ng-model="data.textLine" show="data.isPasswordsShown" password-wrapper>';

        var DEFAULT_PASSWORD_STRING = 'password-string';

        var DEFAULT_PASSWORD_SHOWN_VALUE = true;

        var $rootScope;     //root scope object reference
        var $compile;       //compile function reference
        var defaultData;    //object with default data

        function createDirective(data, template) {

            // Setup scope state
            $rootScope.data = data || defaultData;

            // Create directive element
            var element = angular.element(template || VALID_TEMPLATE);

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

            // Reset data each time
            defaultData = {
                textLine: DEFAULT_PASSWORD_STRING,
                isPasswordsShown: DEFAULT_PASSWORD_SHOWN_VALUE
            };
        });

        describe('when created', function () {
            // Add specs

            it('should have input with the password string', function () {

                var element = createDirective();
                //$rootScope.$digest();

                return expect(element.find('input').val()).toBe(DEFAULT_PASSWORD_STRING);
            });

            it('should have button with glyphicon-eye-close class', function () {

                var element = createDirective();
                //$rootScope.$digest();

                return expect(element.find('span').eq(1).hasClass('glyphicon-eye-close')).toBe(true);

            });

            it('should have input type equals "text"', function () {

                var element = createDirective();
                //$rootScope.$digest();

                return expect(element.find('input').attr('type')).toBe('text');

            });

        });

        describe('when the model changes', function () {

            it('should have input with the updated password string', function () {

                var NEW_PASSWORD_STRING = 'new-password-string'

                var element = createDirective();

                $rootScope.data.textLine = NEW_PASSWORD_STRING;

                $rootScope.$apply();

                return expect(element.find('input').val()).toBe(NEW_PASSWORD_STRING);

            });

            describe('password shown flag to false', function () {

                var element;

                beforeEach(function () {
                    element = createDirective();

                    $rootScope.data.isPasswordsShown = false;

                    $rootScope.$apply();

                })

                it('should have button with "glyphicon-eye-open" class', function () {

                    return expect(element.find('span').eq(1).hasClass('glyphicon-eye-open')).toBe(true);

                });

                it('should have input type equals "password"', function () {

                    return expect(element.find('input').attr('type')).toBe('password');

                });

                it('should have toggle property equals "false" ', function () {

                    return expect(element.isolateScope().toggle).toBe(false);

                });

            });

            describe('password shown flag to true', function () {

                var element;

                beforeEach(function () {
                    element = createDirective();

                    $rootScope.data.isPasswordsShown = true;

                    $rootScope.$apply();

                })

                it('should have button with "glyphicon-eye-close" class', function () {

                    return expect(element.find('span').eq(1).hasClass('glyphicon-eye-close')).toBe(true);

                });

                it('should have input type equals "text"', function () {

                    return expect(element.find('input').attr('type')).toBe('text');

                });

                it('should have toggle property equals "true" ', function () {

                    return expect(element.isolateScope().toggle).toBe(true);

                });

            });

        });

        describe('when changes model in directive', function () {

            it('should change outer model password string', function () {

                var NEW_PASSWORD_STRING = 'new-password-string'

                var element = createDirective();

                var inputElement = element.find('input');

                inputElement.val(NEW_PASSWORD_STRING);

                inputElement.triggerHandler('input');

                $rootScope.$apply();

                return expect($rootScope.data.textLine).toBe(NEW_PASSWORD_STRING);

            });

            it('should not change outer model password shown flag', function () {


                var element = createDirective();

                element.isolateScope().toggle =  false;

                $rootScope.$apply();

                return expect($rootScope.data.isPasswordsShown).toBe(true);

            });

        });

    });

});