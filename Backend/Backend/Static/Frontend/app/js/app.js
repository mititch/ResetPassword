'use strict';

// Declare app level module
angular.module('myApp', [
        'ngRoute',
        'myApp.filters',
        'myApp.services',
        'myApp.directives',
        'myApp.controllers'
    ])
    .config(['apiUrlProvider', function (apiUrlProvider) {
        // Setup base url for the application resources
        apiUrlProvider.setBaseUrl('http://localhost:5869/api/');
    }])
    .config(['$routeProvider', function ($routeProvider) {
        // Setup routes
        $routeProvider.when('/about', {
            templateUrl: 'partials/about.html',
            controller: 'About'
        });
        $routeProvider.when('/reset-password', {
            templateUrl: 'partials/reset-password.html',
            controller: 'ResetPassword'});
        $routeProvider.otherwise({redirectTo: '/about'});
    }]);
