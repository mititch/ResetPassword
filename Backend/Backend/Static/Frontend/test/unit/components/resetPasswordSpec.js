'use strict';

/* jasmine specs for myApp.components.resetPassword module */

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

                inject(function (_$http_, _$httpBackend_, _Password_) {
                    $http = _$http_;
                    $httpBackend = _$httpBackend_;
                    Password = _Password_;
                });
            });

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
                    password = new Password({
                        text: 'password',
                        confirmation: 'confirm',
                        someProp: 'someValue'});
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

                it('should have new text value', function () {
                    return expect(instance.text).toBe('newPassword');
                });

                it('should have new text value', function () {
                    return expect(instance.confirmation).toBe('newConfirmation');
                });

            });

            describe('then "update" called', function () {

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
                    var returnedPromise = instance.$update({});

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

                    $httpBackend.expectPOST(API_URL,function (data) {
                        // Request data
                        return angular.fromJson(data).additionalProperty === 'additionalValue';
                    }).respond({});

                    instance = new Password(SOME_OBJECT);

                    //set up a spy for the callback handler.
                    spyOn(test, 'handler');

                    // Make the call.
                    var returnedPromise = instance.$update({additionalProperty: 'additionalValue'});

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

    //
    //  resetPassword service
    //


    describe('resetPassword service', function () {

        var mockModal;
        var resetPassword;
        var configData;

        beforeEach(function () {

            module('myApp.components.resetPassword');

            module(function (resetPasswordProvider) {

                resetPasswordProvider.initialize(API_URL, TEMPLATE_Url);

            });

            // Provide any mocks needed
            module(function ($provide) {

                mockModal = {
                    open: function (data) {
                        configData = data;
                        return {
                            result: 'someResult'
                        }
                    }
                };

                $provide.value('$modal', mockModal);
            });

            inject(function (_resetPassword_) {
                resetPassword = _resetPassword_;
            });

        })

        it('should return result', function () {

            spyOn(mockModal, 'open').andReturn({result: 'someResult'});

            // Make the call.
            var returnedValue = resetPassword.open('scope', 'customData');

            //check your spy to see if it's been called with the returned value.
            return expect(returnedValue).toBe('someResult');

        });

        it('should call $mobile open', function () {

            //set up a spy for the callback handler.
            spyOn(mockModal, 'open').andReturn({result: 'someResult'});

            // Make the call.
            resetPassword.open('scope', 'customData');

            //check your spy to see if it's been called with the returned value.
            return expect(mockModal.open).toHaveBeenCalled();

        });

        it('should configure $mobile with right data', function () {
            // Make the call.
            resetPassword.open('someScope', 'customData');

            expect(configData.templateUrl).toBe(TEMPLATE_Url);
            expect(configData.scope).toBe('someScope');
            expect(configData.resolve.passwordText()).toBe('');
            expect(configData.resolve.customData()).toBe('customData');
        });

    });

    //
    //  ResetPasswordModalCtrl controller
    //

    describe('ResetPasswordModalCtrl controller', function () {

        var ctrl;
        var $controller;
        var locals;
        var $scope;
        var $modalInstance;
        var Password;
        var $q;
        var $injector;
        var notifications;
        var defered;
        var passwordSpyHelper;
        var $rootScope;

        beforeEach(function () {

            module('myApp.components.resetPassword');

            module(function (resetPasswordProvider) {

                resetPasswordProvider.initialize(API_URL, TEMPLATE_Url);

            });

            // Provide any mocks needed
            module(function ($provide) {
                $provide.value('$modal', {});
            });

            inject(function (_$controller_, _$q_, _$rootScope_) {
                $controller = _$controller_;
                $q = _$q_;
                $rootScope = _$rootScope_;
            });

        });

        beforeEach(function () {

            defered = $q.defer();

            $modalInstance = {
                close: function () {
                },
                dismiss: function () {
                }
            };

            passwordSpyHelper = {

                $update: function (customData) {
                    return defered.promise;
                },

                $generate: function () {
                    return defered.promise;
                }
            };

            Password = function (configuration) {
                angular.extend(this, configuration);

                this.$update = passwordSpyHelper.$update;

                this.$generate = passwordSpyHelper.$generate;

            };

            notifications = {
                add: function () {
                }
            };

            $injector = {
                has: function () {
                    return true;
                },
                get: function () {
                    return notifications;
                }
            };

            $scope = $rootScope.$new();

            locals = {
                $scope: $scope,
                $modalInstance: $modalInstance,
                passwordText: 'someText',
                customData: 'customData',
                Password: Password,
                $injector: $injector
            };

        });


        describe("when created", function () {

            it("should has right scope ", function () {

                ctrl = $controller('ResetPasswordModalCtrl', locals);

                expect($scope.showPasswords).toBe(false);

                expect($scope.disableInputs).toBe(false);

                expect($scope.password.text).toBe('someText');

                expect($scope.password.confirmation).toBe('someText');

            });

        });

        describe("when scope applyChanges called", function () {

            it("should call to Password update", function () {

                spyOn(passwordSpyHelper, '$update').andReturn({then: function () {
                }});

                ctrl = $controller('ResetPasswordModalCtrl', locals);

                $scope.applyChanges();

                expect($scope.disableInputs).toBe(true);

                return expect(passwordSpyHelper.$update).toHaveBeenCalledWith('customData');

            });

            describe("and resolved", function () {

                beforeEach(function () {
                    spyOn($modalInstance, 'close');
                    spyOn(notifications, 'add');
                    ctrl = $controller('ResetPasswordModalCtrl', locals);
                    $scope.applyChanges();
                    defered.resolve({});
                    $rootScope.$apply();
                });

                it("should call to $modalInstance close method with scope password text",
                    function () {
                        return expect($modalInstance.close)
                            .toHaveBeenCalledWith($scope.password.text);
                    }
                );

                it("should update inputs", function () {
                    return expect($scope.disableInputs).toBe(false);
                });

                it("should call to notifications add method", function () {
                    return expect(notifications.add)
                        .toHaveBeenCalledWith('success', 'Password is changed.');
                });

            });

            describe("and rejected", function () {

                beforeEach(function () {
                    spyOn($modalInstance, 'close');
                    spyOn(notifications, 'add');
                    ctrl = $controller('ResetPasswordModalCtrl', locals);
                    $scope.applyChanges();
                    defered.reject({});
                    $rootScope.$apply();
                });

                it("should not call to $modalInstance close method", function () {
                    return expect($modalInstance.close).not.toHaveBeenCalled();
                });

                it("should update inputs", function () {
                    return expect($scope.disableInputs).toBe(false);
                });

                it("should call to notifications add method", function () {
                    return expect(notifications.add)
                        .toHaveBeenCalledWith('danger', 'Server can not reset password.');
                });

            });

        });

        describe("when scope generatePassword called", function () {

            it("should call to Password generate", function () {

                spyOn(passwordSpyHelper, '$generate').andReturn({then: function () {
                }});

                ctrl = $controller('ResetPasswordModalCtrl', locals);

                $scope.generatePassword();

                expect($scope.disableInputs).toBe(true);
                expect($scope.showPasswords).toBe(false);

                return expect(passwordSpyHelper.$generate).toHaveBeenCalled();

            });

            describe("and resolved", function () {

                beforeEach(function () {
                    spyOn(notifications, 'add');
                    ctrl = $controller('ResetPasswordModalCtrl', locals);
                    $scope.generatePassword();
                    defered.resolve({});
                    $rootScope.$apply();
                });

                it("should update inputs", function () {
                    return expect($scope.disableInputs).toBe(false);
                    return expect($scope.showPasswords).toBe(true);

                });

                it("should call to notifications add method", function () {
                    return expect(notifications.add)
                        .toHaveBeenCalledWith('success', 'New password generated.');
                });

            });

            describe("and rejected", function () {

                beforeEach(function () {
                    spyOn(notifications, 'add');
                    ctrl = $controller('ResetPasswordModalCtrl', locals);
                    $scope.generatePassword();
                    defered.reject({});
                    $rootScope.$apply();
                });

                it("should update inputs", function () {
                    return expect($scope.disableInputs).toBe(false);
                });

                it("should call to notifications add method", function () {
                    return expect(notifications.add)
                        .toHaveBeenCalledWith('danger', 'Server can not generate password.');
                });

            });

        });

        describe("when scope cancel", function () {

            it("should call to $modalInstance dismiss", function () {

                spyOn($modalInstance, 'dismiss');

                ctrl = $controller('ResetPasswordModalCtrl', locals);

                $scope.cancel();

                return expect($modalInstance.dismiss).toHaveBeenCalled();

            });

        });

    });

});

