'use strict';

/**
 * Created by mititch on 26.11.13.
 */

angular.module('myApp.components.resetPassword', ['ui.bootstrap.modal'])

    // Saves applications notifications
    // Provide access to add and remove operations
    // Configures with notification template url
    .provider('resetPassword', ['$provide', function ($provide) {

        var self = this;

        // Setup reset password provider
        //      apiUrl - ULR to password reset API
        //      templateUrl - ULR to password reset dialog template
        this.initialize = function (apiUrl, templateUrl) {

            //Save as constant
            $provide.constant('PASSWORD_API_URL', apiUrl);

            //Save as provider property
            self.templateUrl = templateUrl;
        };

        this.$get = ['$templateCache', '$modal', 'Password', '$injector', function ($templateCache, $modal, Password, $injector) {

            // Inject notifications service if it present in collection
            if ($injector.has('notifications'))
            {
                var notifications = $injector.get('notifications');
            }

            var ModalInstanceCtrl = function ($scope, $modalInstance, passwordText, customData) {

                // Setting the hidden password mode for the all password inputs
                $scope.showPasswords = false;

                // Setting the form inputs to the active state
                $scope.disableInputs = false;

                // Create Password instance
                $scope.password = new Password({
                    text: passwordText,
                    confirmation: passwordText
                });

                // Requests a server to save the password update
                $scope.applyChanges = function () {
                    $scope.disableInputs = true;

                    // Call to server API with some specific server data
                    $scope.password.$reset(customData).then(
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
                            !notifications ||notifications.add('danger', 'Server can not reset password.');
                        }
                    );
                };

                // Requests a server to generate new password
                $scope.generatePassword = function ($event) {

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

                // Close dialog without apply changes
                $scope.cancel = function () {
                    // Reject dialog result promise
                    $modalInstance.dismiss();
                }

            };

            return {

                // Open password reset dialog
                reset: function (scope, customData) {

                    // Create and open dialog
                    var modalInstance = $modal.open({
                        templateUrl: self.templateUrl,  //Get templateUrl from provider
                        controller: ModalInstanceCtrl,
                        scope: scope,
                        resolve: {
                            // Pass empty password to dialog
                            passwordText: function () {
                                return '';
                            },
                            // Pass some specific server data
                            // which can be object identity
                            customData : function () {
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

    // Password custom Angular resource
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

        // Requests password reset methods
        // Add class method
        Resource.reset = function (data) {

            // Make post request and return promise to caller
            return $http.post(connectionUrl, data);
        };

        // Add instance method
        Resource.prototype.$reset = function (customData) {

            // Extend specific server data with this
            angular.extend(customData, this);

            // Call to class method
            return Resource.reset(customData);
        };

        // Return constructor function
        return Resource;

    }])
;
