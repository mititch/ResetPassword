'use strict';

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

angular.module('myApp.components.resetPassword', [])
    .constant('resetPasswordTplUrl', 'templates/reset-password/reset-password.tpl.html')
    .constant('passwordApiUrl', '/api/password')

    // Shows a reset password inputs
    .directive('resetPassword', ['resetPasswordTplUrl', 'Password', '$injector',
        function (resetPasswordTplUrl, Password, $injector) {

            // Inject notifications service, if it exists in the collection
            if ($injector.has('notificationsStorage')) {
                var notificationsStorage = $injector.get('notificationsStorage');
            }

            return {
                restrict: 'A',
                templateUrl: resetPasswordTplUrl,
                scope: {
                    passwordText: '=resetPassword',
                    customData: '='
                },
                link: function (scope, element, attrs) {

                    // Setting the hidden password mode for the all password inputs
                    scope.showPasswords = false;
                    // Setting the form inputs to the active state
                    scope.disableInputs = false;

                    // Create a Password instance
                    scope.password = new Password({
                        text: scope.passwordText,
                        confirmation: scope.passwordText
                    });

                    // Requests a server to save the password update
                    scope.applyChanges = function () {

                        // Block inputs
                        scope.disableInputs = true;

                        // Call to server API with some specific server data
                        scope.password.$update(scope.customData).then(
                            function () {
                                // On success
                                scope.disableInputs = false;
                                // If notifications service has been injected notify user
                                !notificationsStorage || notificationsStorage.add('success',
                                    'Password is changed.');
                                // Set form to pristine state
                                scope.form.$setPristine();
                            },
                            function () {
                                // On failure
                                scope.disableInputs = false;
                                // If notifications service has been injected notify user
                                !notificationsStorage || notificationsStorage.add('danger',
                                    'Server can not reset password.');
                            }
                        );
                    };

                    // Requests a server to generate new password
                    scope.generatePassword = function () {

                        // Block inputs
                        scope.showPasswords = false;
                        scope.disableInputs = true;

                        // Call to resource API
                        scope.password.$generate().then(
                            function () {
                                // On success
                                scope.showPasswords = true;
                                scope.disableInputs = false;
                                // If notifications service has been injected notify user
                                !notificationsStorage || notificationsStorage.add('success',
                                    'New password generated.');
                            },
                            function () {
                                // On failure
                                scope.disableInputs = false;
                                // If notifications service has been injected notify user
                                !notificationsStorage || notificationsStorage.add('danger',
                                    'Server can not generate password.');
                            }
                        );
                    };
                }
            };
        }
    ])

    // Custom Angular resource for Password class
    // Provide generate and update operations
    .factory('Password', ['$http', 'passwordApiUrl', function ($http, passwordApiUrl) {

        // Get connection url from constant instantiated in provider
        var connectionUrl = passwordApiUrl;

        // Prepare resource constructor
        var Resource = function (data) {
            // Create required field
            this.text = '';
            this.confirmation = '';
            // Extend object with additional data
            angular.extend(this, data);
        };

        // Requests a new password generation
        // Add class method
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
            return $http.post(connectionUrl, data);
        };

        // Add instance method
        Resource.prototype.$update = function (customData) {

            // Make copy of data
            var data = angular.copy(customData, {});

            // Extend with Password values.
            angular.extend(data, this);

            // Call to the class method
            return Resource.update(data);
        };

        // Return constructor function
        return Resource;
    }]);
