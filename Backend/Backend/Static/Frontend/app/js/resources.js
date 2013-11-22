'use strict';

/* Resources */

angular.module('myApp.resources', ['ngResource'])
    //TODO change to array injection
    .factory('passwordResource', function ($http) {
        return function (resourceName) {

            var connectionUrl =
                'http://localhost:5869/api/' + resourceName;

            var Resource = function (data) {
                angular.extend(this, data);
            };
            Resource.generate = function () {
                return $http.get(connectionUrl).then(function (response) {
                    var result = new Resource(response.data);
                    return result;
                });
            };

            Resource.prototype.$generate = function () {
                return Resource.generate();
            };

            Resource.reset = function (data) {
                return $http.post(connectionUrl, data)
                    .then(function (response) {
                        // TODO: notify success
                        return response;
                    },
                    function (response) {
                        // TODO: notify alert
                        return response;
                    }
                );
            };
            Resource.prototype.$reset = function () {
                return Resource.reset(this);
            };

            return Resource;
        };
    });


