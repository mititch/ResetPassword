'use strict';

/* jasmine specs for directives go here */

describe('myApp.components.ui', function () {
    beforeEach(module('myApp.components.ui'));

    var $rootScope;     //root scope object reference
    var $compile;       //compile function reference
    var validTemplate;    //object with default data
    var defaultData;    //object with default data

    function createDirective(data, template, element) {

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
    // ui-password-input directive
    //

    describe('ui-password-input directive', function () {

        var DEFAULT_TEMPLATE =
            '<ui-password-input ng-model="data.textLine" show-input="data.isPasswordsShown"></ui-password-input>';
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
                    var template = '<form name="form"><ui-password-input name="textLineInput" ng-model="data.textLine" show-input="data.isPasswordsShown"></ui-password-input><form>'
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
                    var template = '<ui-password-input ng-model="data.textLine" show-input="data.isPasswordsShown" ng-disabled="data.disableInput"></ui-password-input>'
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
    // ui-form-field-wrapper directive
    //

    describe('ui-form-field-wrapper directive', function () {

        var validElement;
        var directiveElement;
        var inputElement;

        var DEFAULT_FORM_TEMPLATE =
            '<form></form>';

        var DEFAULT_DIRECTIVE_TEMPLATE =
            '<div ui-form-field-wrapper="fieldName"' +
            'label-text="labelText"' +
            'format-data="{\'someProp1\' : \'someVal1\', \'someProp2\' : \'someVal2\'}"' +
            'validation-data="{\'validationName\' : \'validationText\'}">' +
            '</div>'

        var DEFAULT_INPUT_TEMPLATE =
            '<input type="text" name="fieldName" ng-model="data.inputValue"></div>';

        function createDirectiveFromElement(data, element) {

            // Setup scope state
            $rootScope.data = data || defaultData;

            // Create directive
            $compile(element || validElement)($rootScope);

            // Trigger watchers
            $rootScope.$apply();

            // Return
            return element;
        }

        beforeEach(function () {

            // Reset elements
            inputElement = angular.element(DEFAULT_INPUT_TEMPLATE);
            directiveElement = angular.element(DEFAULT_DIRECTIVE_TEMPLATE).append(inputElement);
            validElement = angular.element(DEFAULT_FORM_TEMPLATE).append(directiveElement);

            // Reset data each time
            defaultData = {
                inputValue: 'someInputValue'
            };
        });

        describe('when created', function () {

            it('should have input with the data model value', function () {
                var element = createDirectiveFromElement();
                return expect(element.find('input').val()).toBe(DEFAULT_PASSWORD_STRING);
            });

            xit('should have button with glyphicon-eye-close class', function () {
                var element = createDirective();
                return expect(element.find('span').eq(1).hasClass('glyphicon-eye-close')).toBe(true);
            });

            xit('should have input type equals "text"', function () {
                var element = createDirective();
                return expect(element.find('input').attr('type')).toBe('text');
            });

            xdescribe('in "form" tag', function () {

                it('should not update element $dirty value', function () {
                    var template = '<form name="form"><ui-password-input name="textLineInput" ng-model="data.textLine" show-input="data.isPasswordsShown"></ui-password-input><form>'
                    var element = createDirective(defaultData, template);
                    return expect($rootScope.form.textLineInput.$dirty).toBe(false);
                });

            });

        });

        xdescribe('when the model changes', function () {

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
                    var template = '<ui-password-input ng-model="data.textLine" show-input="data.isPasswordsShown" ng-disabled="data.disableInput"></ui-password-input>'
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

        xdescribe('when changes model in directive', function () {

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