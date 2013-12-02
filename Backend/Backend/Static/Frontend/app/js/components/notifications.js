'use strict';

/**
 *   The component allows to show the application notifications.
 *
 *   The 'notificationsProvider' may be used to configure component
 *      Usage: notificationsProvider.initialize(templateUrl, maxCount)
 *          templateUrl : string - URL to notification item template (optional)
 *          maxCount : integer - notification collection length (optional, default - 2)
 *      While overriding the default template next properties and methods can be used:
 *          "notification.type"  - string which represents a notification type
 *          "notification.text" - string which represents a notification text
 *          "removeNotification($index)" - removes a current notification
 *
 *   The 'notifications' service may be used to interact with notification storage
 *      Usage: add(type, text)
 *          type : string - represents a notification type
 *          text : string - represents a notification text
 *
 *   The 'notifications-panel' directive may be used to show notifications
 *      Usage: <div class="notifications-panel"></div>
 *      Class '.notifications-container' may be used to update notifications panel CSS styles
 *
 */

angular.module('myApp.components.notifications', [])

    // Configures a 'notifications' service
    // Service stores application notifications and
    // provide access to add and remove operations
    .provider('notifications', function () {

        var self = this;

        // Notifications storage
        self.notifications = [];

        // Max count of saved notifications
        self.maxCount = 2;

        // Configures a notifications provider
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

                    // Remove oldest notification if storage is full
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
            restrict: 'C',
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