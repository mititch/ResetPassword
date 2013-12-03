'use strict';

/* jasmine specs for myApp.components.resetPassword module */

describe('myApp.components.resetPassword', function () {

    var API_URL = '/api/password';
    var TEMPLATE_Url = 'some.template.tpl.html';

    //
    //  resetPassword directive
    //

    describe('resetPassword directive', function () {

        var $rootScope;                 //root scope object reference
        var $compile;                   //compile function reference
        var $http;
        var $httpBackend;
        var $templateCache;              //templateCache reference
        var validTemplate;              //object with default data
        var defaultData;                //object with default data

        var $q;
        var element;
        var passwordSpyHelper;
        var Password;
        var notifications;

        var DEFAULT_TEMPLATE =
            '<div reset-password="password" custom-data="customData"></div>';

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

            module('myApp.components.resetPassword');

            // Provide any mocks needed
            module(function ($provide) {
            });

            // Inject in angular and module constructs
            inject(function (_$http_, _$httpBackend_,_$rootScope_, _$compile_, _$templateCache_) {
                $http = _$http_;
                $httpBackend = _$httpBackend_;
                $rootScope = _$rootScope_.$new();
                $compile = _$compile_;
                $templateCache = _$templateCache_;
            });

            $templateCache.put('templates/reset-password/reset-password.tpl.html', '');

        });

        beforeEach(function () {
            // Reset template
            validTemplate = DEFAULT_TEMPLATE;

            // Reset data each time
            defaultData = {};

        });

        describe("when created", function () {

            it("should has right scope ", function () {

                $rootScope.password = 'someText';

                element = createDirective();

                $rootScope.$apply();

                expect(element.isolateScope().showPasswords).toBe(false);

                expect(element.isolateScope().disableInputs).toBe(false);

                expect(element.isolateScope().password.text).toBe('someText');

                expect(element.isolateScope().password.confirmation).toBe('someText');

            });

        });

        describe("when scope generatePassword called", function () {

            describe("and resolved", function () {

                var theForm;

                beforeEach(function () {

                    $httpBackend.expectGET('/api/password').respond({
                        Text: 'newPassword',
                        Confirmation: 'newConfirmation'
                    });

                    element = createDirective();

                    element.isolateScope().form = theForm;

                    $rootScope.$apply();

                    element.isolateScope().generatePassword();

                    $httpBackend.flush();

                });

                it("should update inputs", function () {

                    expect(element.isolateScope().disableInputs).toBe(false);

                    expect(element.isolateScope().password.text).toBe('newPassword');

                    expect(element.isolateScope().password.confirmation).toBe('newConfirmation');

                });
            });

            describe("and rejected", function () {

                beforeEach(function () {

                    $httpBackend.expectGET('/api/password').respond(404, '');

                    element = createDirective();

                    $rootScope.$apply();

                    element.isolateScope().generatePassword();

                    $httpBackend.flush();

                });

                it("should update inputs", function () {

                    expect(element.isolateScope().disableInputs).toBe(false);

                    expect(element.isolateScope().message).toBe('Server can not generate password.');
                });

            });

        });

        describe("when scope applyChanges called", function () {

            describe("and resolved", function () {

                var theForm;

                beforeEach(function () {

                    theForm = {
                        $setPristine : function () {}
                    };

                    spyOn(theForm, '$setPristine');

                    element = createDirective();

                    element.isolateScope().form = theForm;

                    $rootScope.$apply();

                    $httpBackend.expectPOST('/api/password', element.isolateScope().password )
                        .respond(200,{});

                    element.isolateScope().applyChanges();

                    $httpBackend.flush();

                });

                it("should call to form.$setPristine", function () {
                    return expect(theForm.$setPristine)
                        .toHaveBeenCalled();
                });

                it("should update inputs", function () {

                    expect(element.isolateScope().disableInputs).toBe(false);

                    expect(element.isolateScope().message).toBe('Password is changed.');

                });
            });

            describe("and rejected", function () {

                beforeEach(function () {

                    element = createDirective();

                    $rootScope.$apply();

                    element.isolateScope().applyChanges();

                    $httpBackend.expectPOST('/api/password', element.isolateScope().password )
                        .respond(404,{});

                    $httpBackend.flush();

                });

                it("should update inputs", function () {

                    expect(element.isolateScope().disableInputs).toBe(false);

                    expect(element.isolateScope().message).toBe('Server can not reset password.');

                });

            });

        });
    });
});

