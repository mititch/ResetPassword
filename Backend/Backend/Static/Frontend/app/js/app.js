'use strict';

/* Declare app level module */

angular.module('myApp', [
        'ngRoute',
        'myApp.components.validation',
        'myApp.components.ui',
        'myApp.components.notifications',
        'myApp.components.resources',
        'myApp.components.resetPassword',
        'myApp.pages.about',
        'myApp.pages.users',
        'myApp.pages.userDetails'
    ])
    .config(['$routeProvider',
        function ($routeProvider) {
            // Setup default route
            $routeProvider.otherwise({redirectTo: '/about'});
        }
    ]);

