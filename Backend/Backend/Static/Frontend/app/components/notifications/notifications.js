'use strict';

/**
 *   The component allows to show the application notifications.
 *
 *   The 'notificationsStorage' service may be used to interact with notification storage
 *      Usage: notificationsStorage.add(type, text)
 *          type : string - represents a notification type
 *          text : string - represents a notification text
 *
 *   The 'notifications-panel' directive may be used to show notifications
 *      Usage: <div class="notifications-panel"></div>
 *      Class '.notifications-container' may be used to update notifications panel CSS styles
 *
 *   While overriding the default template next properties and methods can be used:
 *          "notification.type"  - string which represents a notification type
 *          "notification.text" - string which represents a notification text
 *          "removeNotification($index)" - removes a current notification
 */

angular.module('myApp.components.notifications', [])
    .constant('notificationsMaxCount', 3)

    // Stores application notifications and
    // provide access to add and remove operations
    .factory('notificationsStorage', ['notificationsMaxCount', function (notificationsMaxCount) {

        // Notifications storage
        var notifications = [];

        return {
            // Returns a notifications list
            getNotifications: function () {
                return notifications;
            },

            // Add new notification
            add: function (type, text) {

                // Remove oldest notification if storage is full
                if (notifications.length >= notificationsMaxCount) {
                    this.remove(0);
                }

                // Add notification to storage
                notifications.push(
                    {type: type, text: text}
                );
            },

            // Remove notification from storage by index
            remove: function (index) {
                notifications.splice(index, 1);
            }
        };
    }])

    // Shows a notifications from storage
    .directive('notificationsPanel', ['notificationsStorage',
        function (notificationsStorage) {

            return {
                templateUrl: 'components/notifications/notifications-panel.tpl.html',
                restrict: 'C',
                scope: {},
                link: function (scope) {

                    // Get notifications from storage
                    scope.notifications = notificationsStorage.getNotifications();

                    // Remove notification from storage by index
                    scope.removeNotification = function (index) {
                        notificationsStorage.remove(index);
                    };

                }
            };
        }
    ]);