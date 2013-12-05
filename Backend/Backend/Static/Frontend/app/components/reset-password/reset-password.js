'use strict';

/**
 *   The component allows to shows password widget
 *
 *   The 'passwordWidget' directive may be used to extend element with passwords widget markup
 *      Usage: <div password-widget="password" ></div>
 *          password : object - Password resource instance (see: myApp.components.resources)
 *
 *   While overriding the default template next properties and methods can be used:
 *      showPasswords - returns true if user should see the passwords text
 *      disableInputs - returns true if dialog elements should be disabled
 *      password.Text - password text value (may be bound to input)
 *      confirmation.Text - confirmation text value (may be bound to input)
 *      generatePassword() - request Password resource to generate a new password
 */

angular.module('myApp.components.resetPassword', [])
    // Shows a passwords widget markup
    .directive('passwordWidget', ['Password', 'notificationsStorage',
        function (Password, notificationsStorage) {

            return {
                restrict: 'A',
                templateUrl: 'components/reset-password/password-widget.tpl.html',
                scope: {
                    password: '=passwordWidget'
                },
                link: function (scope, element, attrs, ngModelCtrl) {

                    // Make copy for confirmation input
                    scope.confirmation = angular.copy(scope.password);

                    // Setting the hidden password mode for the all password inputs
                    scope.showPasswords = false;
                    // Setting the form inputs to the active state
                    scope.disableInputs = false;

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
                                scope.confirmation.Text = scope.password.Text;
                                // Notify user
                                notificationsStorage.add('success',
                                    'New password generated.');
                            },
                            function () {
                                // On failure
                                scope.disableInputs = false;
                                // Notify user
                                notificationsStorage.add('danger',
                                    'Server can not generate password.');
                            }
                        );
                    };
                }
            };
        }
    ]);
