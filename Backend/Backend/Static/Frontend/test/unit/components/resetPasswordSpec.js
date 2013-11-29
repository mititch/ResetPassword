'use strict';

/* jasmine specs for myApp.components.notifications module */

describe('myApp.components.resetPassword', function () {

    var API_URL = 'http:/someUrl.com/';
    var TEMPLATE_Url = 'some.template.tpl.html';

    //
    //  Password resource
    //

    describe('Password resource', function () {

        var $http, $httpBackend;
        var Password;
        var SOME_OBJECT = {text: 'password', confirmation: 'confirmation'};

        describe('then resetPassword provides was not configured', function () {

            beforeEach(module('myApp.components.resetPassword'));

            it('should throw', function () {

                function errorFunctionWrapper() {
                    inject(function (_Password_) {
                        Password = _Password_;
                    })
                }
                expect(errorFunctionWrapper).toThrow();
            });

        });

        describe('then resetPassword provides was configured', function () {

            beforeEach(function () {

                module('myApp.components.resetPassword');

                module(function (resetPasswordProvider) {

                    resetPasswordProvider.initialize(API_URL, TEMPLATE_Url);

                });

                // Provide any mocks needed
                module(function ($provide) {

                    var mockMobile = {
                        getNotifications: function () {
                            return mockNotifications
                        },
                        getTemplateUrl: function () {
                            return 'templateUrl';
                        },
                        remove: function (index) {
                        }
                    };

                    $provide.value('$mobile', mockMobile);
                });

                inject(function (_$http_, _$httpBackend_, _Password_) {
                    $http = _$http_;
                    $httpBackend = _$httpBackend_;
                    Password = _Password_;
                });

            })

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            describe('then created', function () {

                var password;

                beforeEach(function () {
                    password = new Password();
                });

                it('should have empty text value', function () {
                    return expect(password.text).toBe('');
                });

                it('should have empty confirmation value', function () {
                    return expect(password.confirmation).toBe('');
                });

            });

            describe('then created from object', function () {

                var password;

                beforeEach(function () {
                    password = new Password({text: 'password', confirmation: 'confirm', someProp : 'someValue'});
                });

                it('should have text value from object', function () {
                    return expect(password.text).toBe('password');
                });

                it('should have confirmation value from object', function () {
                    return expect(password.confirmation).toBe('confirm');
                });

                it('should have additional properties from object', function () {
                    return expect(password.someProp).toBe('someValue');
                });

            });

            describe('then "generate" called', function () {

                var instance;

                beforeEach(function () {
                    $httpBackend.expectGET(API_URL).respond({
                        Text: 'newPassword',
                        Confirmation: 'newConfirmation'
                    });

                    instance = new Password(SOME_OBJECT);
                    instance.$generate();
                    $httpBackend.flush();
                });

                it('should call')

                it('should have new text value', function () {
                    return expect(instance.text).toBe('newPassword');
                });

                it('should have new text value', function () {
                    return expect(instance.confirmation).toBe('newConfirmation');
                });

            });

            describe('then "reset" called', function () {

                var instance;
                var test;

                it('should send password data to server', function () {

                    test = {
                        handler: function () {
                        }
                    };

                    $httpBackend.expectPOST(API_URL, SOME_OBJECT).respond({});

                    instance = new Password(SOME_OBJECT);

                    //set up a spy for the callback handler.
                    spyOn(test, 'handler');

                    // Make the call.
                    var returnedPromise = instance.$reset({});

                    // Use the handler you're spying on to handle the resolution of the promise.
                    returnedPromise.then(test.handler);

                    // Flush the backend
                    $httpBackend.flush();

                    //check your spy to see if it's been called with the returned value.
                    return expect(test.handler).toHaveBeenCalled();

                });

                it('should send additional data to server', function () {

                    test = {
                        handler: function () {
                        }
                    };

                    $httpBackend.expectPOST(API_URL, function (data) {
                        // Request data
                        return angular.fromJson(data).additionalProperty ===  'additionalValue';
                    }).respond({});

                    instance = new Password(SOME_OBJECT);

                    //set up a spy for the callback handler.
                    spyOn(test, 'handler');

                    // Make the call.
                    var returnedPromise = instance.$reset({additionalProperty : 'additionalValue'});

                    // Use the handler you're spying on to handle the resolution of the promise.
                    returnedPromise.then(test.handler);

                    // Flush the backend
                    $httpBackend.flush();

                    //check your spy to see if it's been called with the returned value.
                    return expect(test.handler).toHaveBeenCalled();

                });

            });
        });
    });

});

