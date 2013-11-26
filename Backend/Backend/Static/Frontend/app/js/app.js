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
        'myApp.pages.about'
    ])
    .config(['apiUrlProvider', function (apiUrlProvider) {
        // Setup base url for the application resources
        apiUrlProvider.setBaseUrl('http://localhost:5869/api/');
    }])
    .config(['notificationsNewProvider', function (notificationsNewProvider) {
        // Setup base url for the application resources
        notificationsNewProvider.notificationTemplateUrl('templates/notification.tpl.html');
    }])
    /*.run(["notificationsNew", function (notificationsNew) {
        notificationsNew.initialize();
    }])*/
    .config(['$routeProvider', function ($routeProvider) {
        // Setup routes
        $routeProvider.otherwise({redirectTo: '/about'});
    }]);
