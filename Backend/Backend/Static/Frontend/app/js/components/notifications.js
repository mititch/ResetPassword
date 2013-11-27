'use strict';

/**
 * Created by mititch on 26.11.13.
 *
 */

angular.module('myApp.components.notifications', [])
    // Saves applications notifications
    // Provide access to add and remove operations
    // Configures with notification template url
    .provider('notifications', function () {

        var self = this;

        // Notifications storage
        self.notifications = [];

        // Max count of saved notifications
        self.maxCount = 2;

        // Setup notifications provider
        // templateUrl - URL of notification HTML template
        //      template may contains
        //          "notification.type" link - to show notification type
        //          "notification.text" link - to show notification text
        //          "removeNotification($index)" call - to remove current notification
        // maxCount - max count of saved notifications
        self.initialize = function (templateUrl, maxCount) {

            // Save template URL
            self.templateUrl = templateUrl;

            // Save notifications max count
            self.maxCount = maxCount || self.maxCount;
        };

        this.$get = ['$templateCache', function ($templateCache) {

            return {
                // Returns a notifications array
                getNotifications: function () {
                    return self.notifications;
                },

                // Returns a template URL
                getTemplateUrl: function () {
                    return self.templateUrl;
                },

                // Add new notification
                add: function (type, text) {

                    // Remove old notification if storage is full
                    if (self.notifications.length >= self.maxCount) {
                        this.remove(0);
                    }

                    // Add notification to storage
                    self.notifications.push(
                        {type: type, text: text}
                    );
                },

                // Remove notification from storage by index
                remove: function (index) {
                    self.notifications.splice(index, 1);
                }
            };
        }];

    })

    // Shows a notifications from storage
    // Before usage notification provider should be initialized with notifications template URL
    .directive('notificationsPanel', ['notifications',
        function (notifications) {
            return {
                template: '<div ng-repeat="notification in notifications">' +
                    '<ng-include src="templateUrl"></ng-include>' +
                    '</div>',
                restrict: 'A',
                scope: {},
                link: function (scope, element, attrs) {

                    // Get template url
                    scope.templateUrl = notifications.getTemplateUrl();
                    if (!scope.templateUrl) {
                        throw new Error('Notification template url is not set. You must initialize notification provider before usage.');
                    }

                    // Get notifications from storage
                    scope.notifications = notifications.getNotifications();

                    // Remove notification from storage by index
                    scope.removeNotification = function (index) {
                        notifications.remove(index);
                    };
                }
            }
        }]
    );