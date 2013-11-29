'use strict';

/**
 *   The component allows to change the password in the dialog box.
 *   Server side API uses to generate and store password.
 *
 *   The 'resetPasswordProvider' should be used to configure server API endpoint
 *      and to update default dialog template (optional).
 *      Usage: resetPasswordProvider.initialize(apiUrl, templateUrl)
 *          apiUrl : string - URL to server side API (required)
 *          templateUrl : string - URL to dialog box template (optional)
 *      While overriding the default template next properties and methods can be used:
 *          showPasswords - returns true if user should see the passwords text
 *          disableInputs - returns true if dialog elements should be disabled
 *          password.text - password text value (may be bound to input)
 *          password.confirmation - password text value (may be bound to input)
 *          applyChanges() - send server request to update password, on success closes a dialog box and returns
 *              updated password value
 *          generatePassword() - send server request to generate new password
 *          cancel() - close dialog box without changes
 *      It is recommended (but not necessary) to use 'ui-password-input' as input for 'password.text' and
 *          'password.confirmation'
 *
 *   The 'resetPassword' service may be used to open reset password dialog box
 *      Usage: resetPassword.open(scope, customData)
 *          scope : object - an Angular scope to which dialog boх will be attached
 *          customData : object - some specific data which will be sent to server with update password request
 *      Returns: a promise which will be resolved with new password value or rejected when canceling
 *      If 'notifications' service is available in a injector collection, it's used to inform the user about
 *      the execution process
 *
 */

angular.module('myApp.components.resetPassword', ['ui.bootstrap.modal'])

    // Definition of modal dialog controller
    //      '$scope', '$modalInstance', 'passwordText', 'customData' - will be injected by $modal as locals
    //      'Password', '$injector' - will be injected by this module
    .controller('ResetPasswordModalCtrl',
        [ '$scope', '$modalInstance', 'passwordText', 'customData', 'Password', '$injector' ,
        function ($scope, $modalInstance, passwordText, customData, Password, $injector) {

            // Declare notifications service link
            var notifications = false;

            // Inject notifications service, if it exists in the collection
            if ($injector.has('notifications')) {
                notifications = $injector.get('notifications');
            }

            // Setting the hidden password mode for the all password inputs
            $scope.showPasswords = false;

            // Setting the form inputs to the active state
            $scope.disableInputs = false;

            // Create a Password instance
            $scope.password = new Password({
                text: passwordText,
                confirmation: passwordText
            });

            // Requests a server to save the password update
            $scope.applyChanges = function () {
                $scope.disableInputs = true;

                // Call to server API with some specific server data
                $scope.password.$update(customData).then(
                    function () {
                        // On success
                        $scope.disableInputs = false;
                        $modalInstance.close($scope.password.text);
                        // If notifications service has been injected notify user
                        !notifications || notifications.add('success', 'Password is changed.');
                    },
                    function () {
                        // On failure
                        $scope.disableInputs = false;
                        // If notifications service has been injected notify user
                        !notifications || notifications.add('danger', 'Server can not reset password.');
                    }
                );
            };

            // Requests a server to generate new password
            $scope.generatePassword = function () {

                $scope.showPasswords = false;
                $scope.disableInputs = true;

                // Call to resource API
                $scope.password.$generate().then(
                    function () {
                        // On success
                        $scope.showPasswords = true;
                        $scope.disableInputs = false;
                        // If notifications service has been injected notify user
                        !notifications || notifications.add('success', 'New password generated.');
                    },
                    function () {
                        // On failure
                        $scope.disableInputs = false;
                        // If notifications service has been injected notify user
                        !notifications || notifications.add('danger', 'Server can not generate password.');
                    }
                );
            };

            // Close dialog box without apply changes
            $scope.cancel = function () {
                // Reject dialog result promise
                $modalInstance.dismiss();
            }
    }])


    // Configures 'resetPassword' service with server API url and dialog template url
    // Service used to create modal dialog for the password reset
    .provider('resetPassword', ['$provide', function ($provide) {

        var self = this;

        // Setup resetPassword provider
        //      apiUrl - ULR to password update API
        //      templateUrl - ULR to password reset dialog template
        this.initialize = function (apiUrl, templateUrl) {

            //Save as constant
            $provide.constant('PASSWORD_API_URL', apiUrl);

            //Save as provider property
            self.templateUrl = templateUrl;
        };

        this.$get = ['$modal', function ($modal) {

            return {

                // Opens a password reset dialog
                open: function (scope, customData) {

                    // Create and open dialog
                    var modalInstance = $modal.open({
                        templateUrl: self.templateUrl,          // Get templateUrl from provider
                        controller: 'ResetPasswordModalCtrl',   // Take controller from injector
                        scope: scope,
                        resolve: {
                            // Pass empty password to dialog
                            passwordText: function () {
                                return '';
                            },
                            // Pass some specific server data
                            // which can be object identity
                            customData: function () {
                                return customData
                            }
                        }
                    });

                    // Return dialog result promise
                    return modalInstance.result;
                }
            };
        }];

    }])

    // Custom Angular resource for Password class
    // Provide generate and update operations
    .factory('Password', ['$http', 'PASSWORD_API_URL', function ($http, PASSWORD_API_URL) {

        // Get connection url from constant instantiated in provider
        var connectionUrl = PASSWORD_API_URL;

        // Prepare resource constructor
        var Resource = function (data) {
            this.text = '';
            this.confirmation = '';
            angular.extend(this, data);
        };

        // Requests a new password generation methods

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
            return promise;
        };

        // Add instance method
        Resource.prototype.$generate = function () {

            // Call to class method
            return Resource.generate(this);
        };

        // Requests a password update
        // Add class method
        Resource.update = function (data) {

            // Make post request and return promise to caller
            return $http.post(connectionUrl, data);
        };

        // Add instance method
        Resource.prototype.$update = function (customData) {

            // Extend specific server data with this
            angular.extend(customData, this);

            // Call to class method
            return Resource.update(customData);
        };

        // Return constructor function
        return Resource;

    }])
;
