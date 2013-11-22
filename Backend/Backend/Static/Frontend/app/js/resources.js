'use strict';

/* Resources */

angular.module('myApp.resources', ['ngResource'])
    .factory('passwordResource', ['$http', 'apiUrl', '$q' , function ($http, apiUrl, $q) {
        return function (resourceName) {

            var connectionUrl =
                apiUrl.baselUrl + resourceName;

            // Prepare resource constructor
            var Resource = function (data) {
                angular.extend(this, data);
            };

            Resource.generate = function () {
                return $http.get(connectionUrl).then(
                    function (response) {
                        var result = new Resource(response.data);
                        return result;
                    }, function (response) {

                        return $q.reject();
                    }
                );
            };

            Resource.prototype.$generate = function () {
                return Resource.generate();
            };

            Resource.reset = function (data) {
                return $http.post(connectionUrl, data).then(
                    function (response) {
                        return $q.defer().resolve();
                    },
                    function (response) {
                        return $q.reject();
                    }
                );
            };

            Resource.prototype.$reset = function () {
                return Resource.reset(this);
            };

            return Resource;
        };
    }]);


