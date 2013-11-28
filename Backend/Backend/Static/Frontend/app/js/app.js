'use strict';

/* Declare app level module */

angular.module('myApp', [
        'ngRoute',
        'myApp.filters',
        'myApp.services',
        'myApp.directives',
        'myApp.controllers',
        'myApp.components.validation',
        'myApp.components.ui',
        'myApp.components.notifications',
        'myApp.pages.passwords',
        'myApp.pages.about'
    ])
    .config(['notificationsProvider', 'uiProvider', '$routeProvider',
        function (notificationsProvider, uiProvider, $routeProvider) {

            // Setup notifications service with template URL and notifications max count
            notificationsProvider.initialize('templates/notifications/notification.tpl.html', 3);

            // Setup ui templates URLs
            uiProvider.initialize({
                uiPasswordInput: 'templates/ui/ui-password-input.tpl.html',
                uiFormFieldWrapper: 'templates/ui/ui-form-field-wrapper.tpl.html'
            });

            // Setup default route
            $routeProvider.otherwise({redirectTo: '/passwords'});
        }
    ]);

