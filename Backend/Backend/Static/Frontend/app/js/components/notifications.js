'use strict';

/**
 * Created by mititch on 26.11.13.
 *
 */

angular.module('myApp.components.notifications', [])

    // Stores application notifications
    // Provide access to add and remove operations
    .provider('notifications', function () {

        var self = this;

        // Notifications storage
        self.notifications = [];

        // Max count of saved notifications
        self.maxCount = 2;

        // Configures a notifications provider
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

            // If service was not configured register default notification template
            if (!self.templateUrl) {
                $templateCache.put('default-notification.tpl.html',
                    '<div class="alert alert-{{notification.type}}">' +
                    '{{notification.text}}' +
                    '<button ng-click="removeNotification($index)"' +
                    'type="button" class="close" aria-hidden="true">&times;</button>' +
                    '</div>'
                );
            }

            return {

                // Returns a notifications list
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
    .directive('notificationsPanel', ['notifications', function (notifications) {
        return {
            template: '<div ng-repeat="notification in notifications">' +
                '<ng-include src="templateUrl"></ng-include>' +
                '</div>',
            restrict: 'A',
            scope: {},
            link: function (scope, element, attrs) {

                // Get template url from storage or use default
                scope.templateUrl = notifications.getTemplateUrl() || 'default-notification.tpl.html';

                // Get notifications from storage
                scope.notifications = notifications.getNotifications();

                // Remove notification from storage by index
                scope.removeNotification = function (index) {
                    notifications.remove(index);
                };
            }
        }
    }])
;