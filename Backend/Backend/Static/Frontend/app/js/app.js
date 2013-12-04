'use strict';

/* Declare app level module */

angular.module('myApp', [
        'ngRoute',
        'myApp.components.validation',
        'myApp.components.ui',
        'myApp.components.notifications',
        'myApp.components.resources',
        'myApp.pages.about',
        'myApp.pages.users',
        'myApp.pages.userDetails',
        'myApp.pages.resetPassword'
    ])
    .config(['$routeProvider',
        function ($routeProvider) {
            // Setup default route
            $routeProvider.otherwise({redirectTo: '/about'});
        }
    ]);

