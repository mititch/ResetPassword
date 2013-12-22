'use strict';
/**
 *   The component provides a services for the user logon and the application initialization.
 *
 *   The 'CriticalData' service represents the some data storage which must be initialized
 *   before the application start.
 *      Methods:
 *          load() - starts loading data from the server. Returns a promise.
 *          get() - returns data
 *
 *   The 'Initializer' service provides the ability to track the some process execution
 *      Methods:
 *          isReady() - returns 'true' if all registered processes are completed successfully
 *          whenReady() - return the promise which will be resolved when all registered
 *              processes are completed successfully
 *          register(promise) - registers the process promise
 *          waitAll() - starts tracking the all registered promises
 *
 *   The 'Auth' service - user logon and logout
 *
 */

angular.module('myApp.components.authAndInit', [])

    .factory('CriticalData', ['$http',  function ($http) {

        // Data storage
        var criticalData;

        return  {

            load : function () {

                var promise = $http.get('/api/data');

                promise
                    .success(function (data, status) {
                        criticalData = data;
                    })
                    .error(function (data, status) {
                    });

                return promise;
            },

            get : function() {

                return criticalData;
            }

        };

    }])

    .factory('Initializer', ['$q', function ($q) {

        var ready = false;

        var promises = [];

        var deferred = $q.defer();

        return {

            isReady : function () {
                return ready;
            },

            whenReady : function () {
                return deferred.promise;
            },

            register : function (promise) {
                promises.push(promise);
            },

            waitAll : function () {

                $q.all(promises).then(function () {
                    ready = true;
                    deferred.resolve()
                });

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

                var promise = $http.post('/api/auth', {login: login, password: password});

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

    .run(['$rootScope', '$location', 'Auth', 'Initializer', 'CriticalData',
        function ($rootScope, $location, Auth, Initializer, CriticalData) {

            Initializer.register(CriticalData.load());

            Initializer.waitAll();

            $rootScope.$on("$routeChangeStart", function (event, next, current) {

                if ($location.path() != Auth.logonPath
                    && !(Auth.isLoggedIn() && Initializer.isReady()))
                {
                    $location.search('backRoute', $location.path()).path(Auth.logonPath);
                }

            });
        }
    ]);
