'use strict';
//TODO update
/**
 *   The component allows reset the password.
 *   The server side API is used to generate and store the password.
 *
 *
 *   The 'resetPassword' directive may be used to extend element with reset password markup
 *      Usage: <div reset-password="password" custom-data="data"></div>
 *          password : string - represents old password
 *          data : object - some specific data which will be sent to server with update
 *              password request
 *      If 'notifications' service is available in  Angular injector collection, it's used
 *          to inform the user about the execution process.
 *
 *   While overriding the default template next properties and methods can be used:
 *      showPasswords - returns true if user should see the passwords text
 *      disableInputs - returns true if dialog elements should be disabled
 *      password.text - password text value (may be bound to input)
 *      password.confirmation - password text value (may be bound to input)
 *      applyChanges() - send server request to update password, on success closes a dialog box
 *      and returns updated password value
 *      generatePassword() - send server request to generate new password
 *   It is recommended (but not necessary) to use 'ui-password-input' as input
 *          for 'password.text' and 'password.confirmation'
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