'use strict';

/**
 * Created by mititch on 26.11.13.
 */

angular.module('myApp.components.resetPassword', ['ui.bootstrap.modal'])

    // Saves applications notifications
    // Provide access to add and remove operations
    // Configures with notification template url
    .provider('resetPassword', ['$provide', function ($provide) {

        // Setup reset password provider
        // apiUrl - ULR to password reset API
        this.initialize = function (apiUrl) {
            $provide.constant('PASSWORD_API_URL', apiUrl);
        };

        this.$get = ['$templateCache', '$modal', 'Password', function ($templateCache, $modal, Password) {

            var ModalInstanceCtrl = function ($scope, $modalInstance, passwordText) {

                    // Create Password instance
                    $scope.password = new Password({
                        text : passwordText,
                        confirmation : passwordText
                    });

                    // Setting the hidden password mode for the all password inputs
                    $scope.showPasswords = false;

                    // Setting the form inputs to active state
                    // TODO fix bag with "a" element disabling
                    $scope.disableInputs = false;

                    // Requesting to save the model
                    $scope.saveChanges = function () {
                        $scope.disableInputs = true;

                        // Call to resource API
                        $scope.password.$reset().then(
                            function () {
                                // On success
                                notifications.add('success', 'Password is changed.');
                                $scope.form.$setPristine();
                                $scope.disableInputs = false;
                            },
                            function () {
                                // On failure
                                notifications.add('danger', 'Server can not reset password.');
                                $scope.disableInputs = false;
                            }
                        );
                    };

                    // Requesting new password
                    $scope.generatePassword = function ($event) {
                        $scope.showPasswords = false;
                        $scope.disableInputs = true;

                        // Call to resource API
                        $scope.password.$generate().then(
                            function () {
                                // On success
                                $scope.showPasswords = true;
                                $scope.disableInputs = false;
                                $scope.form.$setDirty();
                                notifications.add('success', 'New password generated');
                            },
                            function () {
                                // On failure
                                notifications.add('danger', 'Server can not generate password.');
                                $scope.disableInputs = false;
                            }
                        );

                        // stop event propagation
                        $event.preventDefault();

                    };

                    //OLD
                    /*$scope.ok = function () {
                        $modalInstance.close($scope.data.password);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss();*/
                };


            return {

                // Make password reset
                reset: function (passwordText) {

                    var modalInstance = $modal.open({
                        templateUrl: 'templates/reset-password/dialog.tpl.html',
                        controller: ModalInstanceCtrl,
                        resolve: {
                            passwordText: function () {
                                return passwordText;
                            }
                        }
                    });

                    return modalInstance.result;
                }
            };
        }];

    }])

    // Password custom Angular resource
    .factory('Password', ['$http', 'PASSWORD_API_URL', function ($http, PASSWORD_API_URL) {

        // Get connection url from provider
        var connectionUrl = PASSWORD_API_URL;

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
