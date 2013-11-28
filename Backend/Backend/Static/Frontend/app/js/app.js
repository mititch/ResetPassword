'use strict';

// Declare app level module
angular.module('myApp', [
        'ngRoute',
        'myApp.filters',
        'myApp.services',
        'myApp.directives',
        'myApp.controllers',
        'myApp.components.validation',
        'myApp.components.ui',
        'myApp.components.notifications',
        'myApp.pages.password',
        'myApp.pages.reset',
        'myApp.pages.about'

    ])
    .config(['apiUrlProvider', function (apiUrlProvider) {
        // Setup base url for the application resources
        // TODO Obsolete delete this
        apiUrlProvider.setBaseUrl('http://localhost:5869/api/');
    }])
    .config(['notificationsProvider', 'uiProvider',
        function (notificationsProvider, uiProvider) {
            // Setup notification template url and notifications max count
            notificationsProvider.initialize('templates/notifications/notification.tpl.html', 3);
            // Setup ui templates urls
            uiProvider.initialize({
                uiPasswordInput: 'templates/ui/ui-password-input.tpl.html',
                uiFormFieldWrapper: 'templates/ui/ui-form-field-wrapper.tpl.html'
            });
        }
    ])
    .config(['$routeProvider', function ($routeProvider) {
        // Setup routes
        $routeProvider.otherwise({redirectTo: '/about'});
    }]);
