'use strict';

/* jasmine specs for services go here */

describe('service', function () {

    var API_URL = 'http:/someUrl.com/';

    beforeEach(module('myApp.services', function (apiUrlProvider) {

        apiUrlProvider.setBaseUrl(API_URL);

    }));

    describe('Password', function () {

        var $http, $httpBackend;
        var Password;
        var SOME_OBJECT = {text: 'password', confirmation: 'confirmation'};

        beforeEach(inject(function (_$http_, _$httpBackend_, _Password_) {
            $http = _$http_;
            $httpBackend = _$httpBackend_;
            Password = _Password_;
        }));

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
                password = new Password({text: 'password', confirmation: 'confirm'});
            });

            it('should have text value from object', function () {
                return expect(password.text).toBe('password');
            });

            it('should have confirmation value from object', function () {
                return expect(password.confirmation).toBe('confirm');
            });

        });

        describe('then "generate" called', function () {

            var instance;

            beforeEach(function () {
                $httpBackend.whenGET(API_URL + 'password').respond({
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

            //todo test promise

        });

        describe('then "reset" called', function () {

            var instance;
            var test;

            beforeEach(function () {

                test = {
                    handler: function () {
                    }
                };

                $httpBackend.expectPOST(API_URL + 'password', SOME_OBJECT).respond({});

                instance = new Password(SOME_OBJECT);

                //set up a spy for the callback handler.
                spyOn(test, 'handler');

                // Make the call.
                var returnedPromise = instance.$reset();

                // Use the handler you're spying on to handle the resolution of the promise.
                returnedPromise.then(test.handler);

                // Flush the backend
                $httpBackend.flush();

            });

            it('should send data to server', function () {
                //check your spy to see if it's been called with the returned value.
                return expect(test.handler).toHaveBeenCalled();

            });

        });

    });

});
