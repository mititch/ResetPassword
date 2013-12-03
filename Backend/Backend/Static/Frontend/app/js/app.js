'use strict';

/* Declare app level module */

angular.module('myApp', [
        'ngRoute',
        'myApp.components.validation',
        'myApp.components.ui',
        'myApp.pages.about',
        'myApp.pages.resetPassword'
    ])
    .config(['$routeProvider',
        function ($routeProvider) {
            // Setup default route
            $routeProvider.otherwise({redirectTo: '/passwords'});
        }
    ]);

