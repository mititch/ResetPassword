'use strict';

/* jasmine specs for directives go here */

describe('directives', function () {
    beforeEach(module('myApp.directives'));

    var $rootScope;     //root scope object reference
    var $compile;       //compile function reference
    var validTemplate;    //object with default data
    var defaultData;    //object with default data

    function createDirective(data, template) {

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

    describe('password', function () {

        var DEFAULT_TEMPLATE =
            '<password ng-model="data.textLine" show-input="data.isPasswordsShown"></password>';
        var DEFAULT_PASSWORD_STRING = 'password-string';
        var DEFAULT_PASSWORD_SHOWN_VALUE = true;

        beforeEach(function () {
            // Reset template
            validTemplate = DEFAULT_TEMPLATE;

            // Reset data each time
            defaultData = {
                textLine: DEFAULT_PASSWORD_STRING,
                isPasswordsShown: DEFAULT_PASSWORD_SHOWN_VALUE
            };
        });

        describe('when created', function () {

            it('should have input with the password string', function () {
                var element = createDirective();
                return expect(element.find('input').val()).toBe(DEFAULT_PASSWORD_STRING);
            });

            it('should have button with glyphicon-eye-close class', function () {
                var element = createDirective();
                return expect(element.find('span').eq(1).hasClass('glyphicon-eye-close')).toBe(true);
            });

            it('should have input type equals "text"', function () {
                var element = createDirective();
                return expect(element.find('input').attr('type')).toBe('text');
            });

            describe('in "form" tag', function () {

                it('should not update element $dirty value', function () {
                    var template = '<form name="form"><password name="textLineInput" ng-model="data.textLine" show-input="data.isPasswordsShown"></password><form>'
                    var element = createDirective(defaultData, template);
                    return expect($rootScope.form.textLineInput.$dirty).toBe(false);
                });

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

            describe('with "ng-disable" directive', function () {
                var element;

                beforeEach(function () {
                    var template = '<password ng-model="data.textLine" show-input="data.isPasswordsShown" ng-disabled="data.disableInput"></password>'
                    var data = {
                        textLine : 'some line',
                        isPasswordsShown : true,
                        disableInput : false
                    }
                    element = createDirective(data, template);
                    $rootScope.$apply();
                })

                describe('set to true', function ()
                {
                    beforeEach(function () {
                        $rootScope.data.disableInput = true;
                        $rootScope.$apply();
                    });

                    it('should disable input', function () {
                        return expect(element.find('input').attr('disabled')).toBe('disabled');
                    });

                    it('should disable button', function () {
                        return expect(element.find('button').attr('disabled')).toBe('disabled');
                    });

                });

                describe('set to false', function ()
                {
                    beforeEach(function () {
                        $rootScope.data.disableInput = false;
                        $rootScope.$apply();
                    });

                    it('should not disable input', function () {
                        return expect(element.find('input').attr('disabled')).not.toBeDefined();
                    });

                    it('should not disable button', function () {
                        return expect(element.find('button').attr('disabled')).not.toBeDefined();
                    });

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