'use strict';

/* Services */

angular.module('myApp.services', [])

    .provider('apiUrl', function() {

        this.baselUrl = '';

        // Provider setup method
        this.setBaseUrl = function(baselUrl) {
            this.baselUrl = baselUrl;
        };

        this.$get = function() {
            return {
                passwordApiUrl : this.baselUrl + 'password'
            };
        };

    })

    .factory('notificationsStorage', function () {
        return {
            notifications: [{type: 'info', text: "Application started"}],

            add:function (type, text) {
                if (this.notifications.length > 2) {
                    this.remove(0);
                }
                this.notifications.push(
                    {type: type, text: text}
                );
            },

            remove : function (index) {
                this.notifications.splice(index, 1);
            }
        };
    })
    .factory('Password', ['$http', 'apiUrl', '$q' , function ($http, apiUrl, $q) {

        var connectionUrl = apiUrl.passwordApiUrl;

        // Prepare resource constructor
        var Resource = function (data) {
            this.text = '';
            this.confirmation = '';
            angular.extend(this, data);
        };

        // Add class method
        Resource.generate = function (data) {

            var promise = $http.get(connectionUrl);

            // Update instance on success
            promise.then(
                function (response) {
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
        Resource.reset = function (data) {

            // Make post request and return promise to caller
            return $http.post(connectionUrl, data);
        };

        // Add instance method
        Resource.prototype.$reset = function () {
            return Resource.reset(this);
        };

        return Resource;

    }])
;
