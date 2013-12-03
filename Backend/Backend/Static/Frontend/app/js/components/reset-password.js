'use strict';

/**
 *   The component allows reset the password.
 *   The server side API is used to generate and store the password.
 *
 *
 *   The 'resetPassword' directive may be used to extend element with reset password markup
 *      Usage: <div reset-password="password" ></div>
 *          password : string - represents old password
 *
 *   While overriding the default template next properties and methods can be used:
 *      showPasswords - returns true if user should see the passwords text
 *      disableInputs - returns true if dialog elements should be disabled
 *      message - contains reset or update notification
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
    .directive('resetPassword', ['resetPasswordTplUrl', 'passwordApiUrl', '$http',
        function (resetPasswordTplUrl, passwordApiUrl, $http) {

            return {
                restrict: 'A',
                templateUrl: resetPasswordTplUrl,
                scope: {
                    passwordText: '=resetPassword'
                },
                link: function (scope) {

                    // Setting the hidden password mode for the all password inputs
                    scope.showPasswords = false;
                    // Setting the form inputs to the active state
                    scope.disableInputs = false;

                    // Create a password object
                    scope.password = {
                        text: scope.passwordText,
                        confirmation: scope.passwordText
                    };

                    // Requests a server to save the password update
                    scope.applyChanges = function () {
                        scope.message = 'Processing...';

                        // Block inputs
                        scope.disableInputs = true;

                        $http.post(passwordApiUrl, scope.password).then(
                            function () {
                                // On success
                                scope.disableInputs = false;
                                scope.message = 'Password is changed.';
                                // Set form to pristine state
                                scope.form.$setPristine();
                            },
                            function () {
                                // On failure
                                scope.disableInputs = false;
                                scope.message = 'Server can not reset password.';
                            }
                        );
                    };

                    // Requests a server to generate new password
                    scope.generatePassword = function () {
                        scope.message = 'Processing...';
                        // Block inputs
                        scope.showPasswords = false;
                        scope.disableInputs = true;

                        // Call to resource API
                        $http.get(passwordApiUrl).then(
                            function (response) {
                                // On success
                                scope.password.text = response.data.Text;
                                scope.password.confirmation = response.data.Confirmation;
                                scope.showPasswords = true;
                                scope.disableInputs = false;
                                scope.message = 'New password generated.';
                            },
                            function () {
                                // On failure
                                scope.disableInputs = false;
                                scope.message = 'Server can not generate password.';
                            }
                        );
                    };
                }
            };
        }
    ]);

