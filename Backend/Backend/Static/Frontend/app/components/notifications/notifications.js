'use strict';

/**
 *   The component allows to show the application notifications.
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
 *   While overriding the default template next properties and methods can be used:
 *          "notification.type"  - string which represents a notification type
 *          "notification.text" - string which represents a notification text
 *          "removeNotification($index)" - removes a current notification
 */

angular.module('myApp.components.notifications', [])
    .constant('notificationsMaxCount', 3)
    // TODO remove
    .constant('notificationTplUrl', 'components/notifications/notification.tpl.html')

    // Stores application notifications and
    // provide access to add and remove operations
    //TODO update to servise
    .provider('notificationsStorage', function () {

        var self = this;

        // Notifications storage
        self.notifications = [];

        this.$get = ['notificationsMaxCount', function (notificationsMaxCount) {

            return {

                // Returns a notifications list
                getNotifications: function () {
                    return self.notifications;
                },

                // Add new notification
                add: function (type, text) {

                    // Remove oldest notification if storage is full
                    if (self.notifications.length >= notificationsMaxCount)
                    {
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
    .directive('notificationsPanel', ['notificationsStorage', 'notificationTplUrl',
        function (notificationsStorage, notificationTplUrl) {
            return {
                //TODO move to tpl
                //TODO kill include
                template: '<div ng-repeat="notification in notifications">' +
                    '<ng-include src="\'' +notificationTplUrl + '\'"></ng-include>' +
                    '</div>',
                restrict: 'C',
                scope: {},
                link: function (scope) {

                    // Get notifications from storage
                    //TODO check incapsulation
                    scope.notifications = notificationsStorage.getNotifications();

                    // Remove notification from storage by index
                    scope.removeNotification = function (index) {
                        notificationsStorage.remove(index);
                    };

                }
            };
        }
    ])
;