'use strict';

/* jasmine specs for myApp.components.resetPassword module */

describe('myApp.components.resetPassword', function () {

    var API_URL = '/api/password';
    var TEMPLATE_Url = 'some.template.tpl.html';

    //
    //  Password resource
    //

    describe('Password resource', function () {

        var $http, $httpBackend;
        var Password;
        var SOME_OBJECT = {text: 'password', confirmation: 'confirmation'};


        beforeEach(function () {

            module('myApp.components.resetPassword');

            // Provide any mocks needed
            module(function ($provide) {

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

    //
    //  resetPassword directive
    //

    describe('resetPassword directive', function () {

        var $rootScope;                 //root scope object reference
        var $compile;                   //compile function reference
        var $templateCache              //templateCache reference
        var validTemplate;              //object with default data
        var defaultData;                //object with default data
        var mockNotificationService;    //notification service link

        var $q;
        var defered;
        var element;
        var passwordSpyHelper;
        var Password;
        var notifications;
        var $injector;

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

                passwordSpyHelper = {

                    $update: function (customData) {
                    },

                    $generate: function () {
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

                /*$injector = {
                    has: function () {
                        return true;
                    },
                    get: function () {
                        return notifications;
                    }
                };*/

                $provide.value('Password', Password);
                $provide.value('Password', Password);
                $provide.value('notifications', notifications);

            });

            // Inject in angular and module constructs
            inject(function (_$rootScope_, _$compile_, _$templateCache_, _$q_) {
                $rootScope = _$rootScope_.$new();
                $compile = _$compile_;
                $q = _$q_;
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

                var someData = {
                  someProp : 'someVal'
                };

                $rootScope.password = 'someText';
                $rootScope.customData = someData;

                element = createDirective();

                $rootScope.$apply();

                expect(element.isolateScope().showPasswords).toBe(false);

                expect(element.isolateScope().disableInputs).toBe(false);

                expect(element.isolateScope().password.text).toBe('someText');

                expect(element.isolateScope().password.confirmation).toBe('someText');

                expect(element.isolateScope().customData).toBe(someData);

            });

        });

        describe("when scope applyChanges called", function () {

            it("should call to Password update", function () {

                spyOn(passwordSpyHelper, '$update').andReturn({then: function () {
                }});

                $rootScope.customData = 'customData';

                element = createDirective();

                $rootScope.$apply();

                element.isolateScope().applyChanges();

                expect(element.isolateScope().disableInputs).toBe(true);

                return expect(passwordSpyHelper.$update).toHaveBeenCalledWith('customData');

            });

            describe("and resolved", function () {

                var defered;
                var theForm;

                beforeEach(function () {
                    //spyOn(form, '$setPristine');

                    theForm = {
                        $setPristine : function () {}
                    }

                    defered = $q.defer();

                    spyOn(theForm, '$setPristine');

                    spyOn(passwordSpyHelper, '$update').andReturn(defered.promise);

                    spyOn(notifications, 'add');

                    element = createDirective();

                    element.isolateScope().form = theForm;

                    element.isolateScope().applyChanges();
                    defered.resolve({});
                    $rootScope.$apply();

                });

                it("should call to form.$setPristine", function () {
                        return expect(theForm.$setPristine)
                            .toHaveBeenCalled();
                });

                it("should update inputs", function () {
                    return expect(element.isolateScope().disableInputs).toBe(false);
                });

                it("should call to notifications add method", function () {
                    return expect(notifications.add)
                        .toHaveBeenCalledWith('success', 'Password is changed.');
                });

            });

            describe("and rejected", function () {

                var defered;
                var theForm;

                beforeEach(function () {
                    theForm = {
                        $setPristine : function () {}
                    }

                    defered = $q.defer();

                    spyOn(passwordSpyHelper, '$update').andReturn(defered.promise);

                    spyOn(notifications, 'add');

                    element = createDirective();

                    element.isolateScope().form = theForm;

                    element.isolateScope().applyChanges();
                    defered.reject({});
                    $rootScope.$apply();

                });

                it("should update inputs", function () {
                    return expect(element.isolateScope().disableInputs).toBe(false);
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

                $rootScope.customData = 'customData';

                $rootScope.$apply();

                element = createDirective();

                element.isolateScope().generatePassword();

                expect(element.isolateScope().disableInputs).toBe(true);
                expect(element.isolateScope().showPasswords).toBe(false);

                return expect(passwordSpyHelper.$generate).toHaveBeenCalled();

            });

            describe("and resolved", function () {

                var defered;
                var theForm;

                beforeEach(function () {

                    defered = $q.defer();

                    spyOn(passwordSpyHelper, '$generate').andReturn(defered.promise);

                    spyOn(notifications, 'add');

                    element = createDirective();

                    element.isolateScope().generatePassword();
                    defered.resolve({});
                    $rootScope.$apply();

                });

                it("should update inputs", function () {
                    return expect(element.isolateScope().disableInputs).toBe(false);
                    return expect(element.isolateScope().showPasswords).toBe(true);
                });

                it("should call to notifications add method", function () {
                    return expect(notifications.add)
                        .toHaveBeenCalledWith('success', 'New password generated.');
                });

            });

            describe("and rejected", function () {

                var defered;
                var theForm;

                beforeEach(function () {

                    defered = $q.defer();

                    spyOn(passwordSpyHelper, '$generate').andReturn(defered.promise);

                    spyOn(notifications, 'add');

                    element = createDirective();

                    element.isolateScope().generatePassword();
                    defered.reject({});
                    $rootScope.$apply();

                });

                it("should update inputs", function () {
                    return expect(element.isolateScope().disableInputs).toBe(false);
                });

                it("should call to notifications add method", function () {
                    return expect(notifications.add)
                        .toHaveBeenCalledWith('danger', 'Server can not generate password.');
                });

            });

        });

    });


});

