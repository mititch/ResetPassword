'use strict';

/* Services */

angular.module('myApp.services', [])

    // After configuration returns resource API ULRs
    .provider('apiUrl', function() {

        // API base url
        this.baselUrl = '';

        // Provider setup method
        this.setBaseUrl = function(baselUrl) {
            this.baselUrl = baselUrl;
        };

        this.$get = function() {
            return {
                // Returns a password api url
                passwordApiUrl : this.baselUrl + 'password'
            };
        };

    })
    // Password custom Angular resource
    .factory('PasswordOLD', ['$http', 'apiUrl', function ($http, apiUrl) {

        // Get connection url from provider
        var connectionUrl = apiUrl.passwordApiUrl;

        // Prepare resource constructor
        var Resource = function (data) {
            this.text = '';
            this.confirmation = '';
            angular.extend(this, data);
        };

        // Add class method
        // Requests a new password generation
        Resource.generate = function (data) {

            // Make request
            var promise = $http.get(connectionUrl);

            // Update instance on success
            promise.then(
                function (response) {
                    //On success update instance
                    data.text = response.data.Text;
                    data.confirmation = response.data.Confirmation;
                }
            );

            // Return promise to caller
            return promise;
        };

        // Add instance method
        Resource.prototype.$generate = function () {
            return Resource.generate(this);
        };

        // Add class method
        // Requests password reset
        Resource.reset = function (data) {

            // Make post request and return promise to caller
            return $http.post(connectionUrl, data);
        };

        // Add instance method
        Resource.prototype.$reset = function () {
            return Resource.reset(this);
        };

        // Return constructor function
        return Resource;

    }])
;
