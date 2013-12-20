'use strict';
// TODO: update
/**
 *   The component allows intercept route change.
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

angular.module('myApp.components.auth', [])

    .factory('CriticalData', ['$http', '$q', function ($http, $q) {

        var criticalData;

        return {
            reload : function () {

                var deferred = $q.defer();

                $http.get('/api/data')
                    .success(function (data, status) {
                        criticalData = data;
                        deferred.resolve();
                    })
                    .error(function (data, status) {
                        deferred.reject();
                    });

                return deferred.promise;
            },

            get : function() {

                return criticalData;
            },

            isReady : function () {

                return !!criticalData;
            }

        };

    }])

    .factory('Auth', ['$http', function ($http) {

        var isLoggedIn;

        return {

            isLoggedIn: function () {
                 return isLoggedIn;
            },

            logon: function (login, password) {
                $http.post('/api/auth', {login: login, password: password}).success(function (responce) {
                    isLoggedIn = true;
                });
            },

            logout: function () {
                $http.delete('/api/auth').success(function () {
                    isLoggedIn = false;
                });
            }

        };
    }])
    .run(['$rootScope', '$location', 'Auth', 'CriticalData',
        function ($rootScope, $location, Auth, CriticalData) {
            var LOGON_URL = '/logon';

            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (!(Auth.isLoggedIn() && CriticalData.isReady()) || next.$$route.originalPath == LOGON_URL) {
                    // TODO: save previous path
                    $location.path(LOGON_URL);
                }
            });

        }
    ]);
