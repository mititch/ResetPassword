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

    .factory('CriticalData', ['$http', '$q', 'Initializer',  function ($http, $q, Initializer) {

        var criticalData;

        var instance =  {
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

        return instance;

    }])

    .factory('Initializer', ['$q', function ($q) {

        var appReady = false;

        var started = false;

        var actions = [];

        return {

            isReady : function () {
                return appReady;
            },

            register : function (action) {
                actions.push(action);
            },

            initialize : function () {

                if (started) { return;}

                started = true;

                var promises = [];

                angular.forEach(actions, function (action) {
                    promises.push(action());
                })

                var readyPromise = $q.all(promises);

                readyPromise.then( function () {
                    appReady = true;
                });

                return readyPromise;
            }

        };
    }])

    .factory('Auth', ['$http', function ($http) {

        var isLoggedIn;

        return {
            //logonUrl : '/logon',

            isLoggedIn: function () {
                 return isLoggedIn;
            },

            logon: function (login, password) {

                //var promise = $http.post('/api/auth', {login: login, password: password});
                var promise = $http.post('/api/auth', {login: login});

                promise.success(function (responce) {
                    isLoggedIn = true;
                });

                return promise;
            },

            logout: function () {
                var promise = $http.delete('/api/auth');

                promise.success(function () {
                    isLoggedIn = false;
                });

                return promise;
            }

        };
    }])
    .run(['$rootScope', '$location', 'Auth', 'CriticalData', 'Initializer',
        function ($rootScope, $location, Auth, CriticalData, Initializer) {

            // TODO: or Initializer.initialize = Initializer.initialize();
            Initializer.whenReady = Initializer.initialize();

            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (next.$$route && next.$$route.originalPath != Auth.logonUrl
                    && !(Auth.isLoggedIn() && CriticalData.isReady())) {
                    // TODO: save previous path
                    $location.path(Auth.logonUrl);
                }
            });

        }
    ]);
