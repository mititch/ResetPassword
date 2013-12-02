'use strict';

/* jasmine specs for myApp.components.notifications module */

describe('myApp.components.notifications', function () {

    //
    //  notifications service
    //

    describe('notifications service', function () {

        var notifications;

        beforeEach(function () {
                module('myApp.components.notifications', function (notificationsProvider) {
                    notificationsProvider.initialize('someUrl', 3);
                });

                inject(function (_notifications_) {
                    notifications = _notifications_;
                })
            }
        );

        it('should return correct notifications count', function () {
            return expect(notifications.getNotifications().length).toBe(0);
        });

        it('should return correct templateUrl', function () {
            return expect(notifications.getTemplateUrl()).toBe('someUrl');
        });

        it('should add notification', function () {
            notifications.add('type', 'text')
            var notification = notifications.getNotifications()[0]
            expect(notification.text).toBe('text');
            expect(notification.type).toBe('type');
        });

        it('should remove notification', function () {
            notifications.add('type', 'text')
            notifications.add('type', 'text')
            var notification = notifications.remove(0);
            return expect(notifications.getNotifications().length).toBe(1);
        });

        it('should not overhead notification limit', function () {
            for (var i = 0; i < 10; i++ ) {
            notifications.add('type', 'text')
            }
            return expect(notifications.getNotifications().length).toBe(3);
        });
    });

    //
    //  notification-panel directive
    //

    describe('notification-panel directive', function () {

        var $rootScope;                 //root scope object reference
        var $compile;                   //compile function reference
        var $templateCache              //templateCache reference
        var validTemplate;              //object with default data
        var defaultData;                //object with default data
        var mockNotificationService;    //notification service link

        var mockNotifications =
            ['1', '2', '3'];
        var DEFAULT_TEMPLATE =
            '<div class="notifications-panel"></div>';

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

            module('myApp.components.notifications');

            // Provide any mocks needed
            module(function ($provide) {

                mockNotificationService = {
                    getNotifications: function () {
                        return mockNotifications
                    },
                    getTemplateUrl: function () {
                        return 'templateUrl';
                    },
                    remove: function (index) {
                    }
                };

                $provide.value('notifications', mockNotificationService);
            });

            // Inject in angular and module constructs
            inject(function (_$rootScope_, _$compile_, _$templateCache_) {
                $rootScope = _$rootScope_.$new();
                $compile = _$compile_;
                $templateCache = _$templateCache_;
            });

        });

        beforeEach(function () {
            // Reset template
            validTemplate = DEFAULT_TEMPLATE;

            // Reset data each time
            defaultData = {};

            $templateCache.put('templateUrl', '<span></span>');
        });

        describe('when created', function () {

            var element;
            beforeEach(function () {
                element = createDirective();
            });

            it('should have correct notifications count', function () {
                return expect(element.find('div').children().length).toBe(3);
            });

            it('should have correct notification template', function () {
                return expect(element.find('ng-include').html()).toBe('<span class="ng-scope"></span>');
            });

            it('should make call remove notification', function () {
                spyOn(mockNotificationService, 'remove');
                element.isolateScope().removeNotification(1);
                return expect(mockNotificationService.remove).toHaveBeenCalledWith(1);
            });

        });

        describe('when notifications updated', function () {

            it('should have correct notifications count', function () {
                var element = createDirective();
                $rootScope.$apply(function () {
                    mockNotifications.push('4');
                });
                return expect(element.find('div').children().length).toBe(4);
            });

        });
    });
});