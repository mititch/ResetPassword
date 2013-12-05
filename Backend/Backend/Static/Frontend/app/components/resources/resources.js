'use strict';

/**
 *   The component contains application resources
 *   The server side API is used to generate and store the password.
 *
 *
 *   The 'Password' factory may be used to instantiate Password object
 *      Usage: new Password(userId, text)
 *          userId : integer - user identifier
 *          text : string - password text
 *      Fields:
 *          UserId - user identifier
 *          Text - password text
 *      Methods:
 *          $generate() - requests server to generate new password
 *          $update() - updates a server password value with the instance 'Text' field
 *
 *   The 'User' factory may be used to instantiate User object
 *      Usage: standard Angular $resource
 *      Fields:
 *          Id - user identifier
 *      Methods:
 *          $query() - requests users list from server
 *          $get({Id: userIdValue}) - requests single user by Id
 *      Important: Other Angular $resource operations not implemented on the server side!
 *
 */

angular.module('myApp.components.resources', ['ngResource'])
    .constant('passwordsApiUrl', '/api/user/:userId/password')
    .constant('usersApiUrl', '/api/user/:id')

    // Custom Angular resource for Password class
    // Provide generate and update operations
    .factory('Password', ['$http', 'passwordsApiUrl', function ($http, passwordsApiUrl) {

        // Prepare resource constructor
        var Resource = function (userId, text) {
            this.Text = text || '';
            this.UserId = userId;
        };

        // Requests a new password generation
        // Add class method
        Resource.generate = function (data) {

            // Make request
            var promise = $http.get(passwordsApiUrl.replace(':userId', data.UserId))
                .then (function (responce) {
                    //On success update instance
                    data.Text = responce.data.text;
                }
            );

            // Return promise to caller
            // Can be used to handle success or failure response
            return promise;
        };

        // Add instance method
        Resource.prototype.$generate = function () {

            // Call to the class method
            return Resource.generate(this);
        };

        // Requests a password update
        // Add class method
        Resource.update = function (data) {

            // Make post request and return promise to caller
            // Can be used to handle success or failure response
            return $http.post(passwordsApiUrl.replace(':userId', data.UserId), data);
        };

        // Add instance method
        Resource.prototype.$update = function () {
            // Call to the class method
            return Resource.update(this);
        };

        // Return constructor function
        return Resource;
    }])

    // Custom Angular resource for Password class
    // Provide generate and update operations
    .factory('User', ['$resource', 'usersApiUrl', 'Password', function ($resource, usersApiUrl, Password) {


        var Resource = $resource(usersApiUrl, {id:'@Id'});

        /*Resource.prototype.$resetPassword = function(text) {
            var password = new Password(this.Id, text);
            password.$update();
        };*/

        // Return constructor function
        return Resource;
    }]);