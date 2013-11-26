'use strict';

/**
 * Created by mititch on 26.11.13.
 */

angular.module('myApp.components.notifications', [])
    .constant('DEFAULT_TEMPLATE_URL', 'notification.tpl.html')
    // Saves applications notifications
    // Provide access to add and remove operations
    // Configures with notification template url
    .provider('notificationsNew', function () {

        var self = this;

        //Base template
        self.templateUrl = '';

        // Provider setup method
        this.notificationTemplateUrl = function (templateUrl) {
            self.templateUrl = templateUrl;

        };

        this.$get = ['$q', 'DEFAULT_TEMPLATE_URL', '$http', '$templateCache', '$interpolate', function ($q, DEFAULT_TEMPLATE_URL, $http, $templateCache, $interpolate) {

            function loadTemplate(templateUrl) {
                return $http.get(templateUrl, {cache: $templateCache}).then(
                    function (response) {
                        return response.data;
                    }
                    , function (response) {
                        throw new Error('Template not found: ' + template);
                    });
            }

            return {
                // Notifications storage
                notifications: {type : 'success', text : 'Notification!'},

                // Add new notifications
                add: function (type, text) {

                    // Remove old notification
                    if (this.notifications.length > 2) {
                        this.remove(0);
                    }

                    this.notifications.push(
                        {type: type, text: text}
                    );
                },

                // Remove notifications
                remove: function (index) {
                    this.notifications.splice(index, 1);
                },

                // Return template url
                initialize: function () {
                    var deferred = $q.defer()

                    loadTemplate(self.templateUrl).then(function (data) {
                        var template = $interpolate(data);
                        var scope = { type:'{{notification.type}}', text:'{{notification.text}}', closeFn:'removeNotification($index)' };
                        var element = template(scope);
                        $templateCache.put(DEFAULT_TEMPLATE_URL, element);
                        deferred.resolve('a');
                    });

                    return deferred.promise;
                }
            };
        }];

    })

    .directive('notificationPanelNew', ['$compile', 'notificationsNew', 'DEFAULT_TEMPLATE_URL', '$http', '$templateCache', '$interpolate',
        function ($compile, notificationsNew, DEFAULT_TEMPLATE_URL, $http, $templateCache, $interpolate) {

            /*function loadTemplate(templateUrl) {
                return $http.get(templateUrl, {cache: $templateCache}).then(
                    function (response) {
                        return response.data;
                    }
                    , function (response) {
                        throw new Error('Template not found: ' + template);
                    });
            }*/

            var ngIncludeElement = angular.element('<ng-include src=' + DEFAULT_TEMPLATE_URL + '></ng-include>')

            return {
                template:
                    '<div ng-repeat="notification in notifications">' +
                    '{{notification.text}}' +
                    '</div>',
                restrict: 'A',
                //replace: true,
                compile: function (tElement, tAttrs) {

                    var nt = notificationsNew.notifications;
                    //tElement.append(ngIncludeElement);

                    /*loadTemplate(notificationsNew.getTemplateUrl()).then(function (data) {
                        var template = $interpolate(data);
                        var scope = { type:'{{notification.type}}', text:'{{notification.text}}', closeFn:'removeNotification($index)' };
                        var element = template(scope);
                        $templateCache.put('DEFAULT_TEMPLATE_URL', element);
                    });*/

                    return function (scope, element, attrs) {

                        //scope.templatePath = DEFAULT_TEMPLATE_URL;
                        scope.a = notificationsNew.initialize();

                        // Get notifications from storage
                        scope.notifications = notificationsNew.notifications;

                        // Remove notification from storage by index
                        scope.removeNotification = function (index) {
                            notificationsNew.remove(index);
                        };

                    }
                }
            }
        }]
    )