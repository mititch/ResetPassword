'use strict';

/**
 * Configures 'about' page route and provide the page controller
 */

angular.module('myApp.pages.about', [])

    .config(['$routeProvider', function ($routeProvider) {
        // Configure route for this page
        $routeProvider.when('/about', {
            templateUrl: 'pages/about/about.html',
            controller: 'AboutPage'
        });
    }])

    /* Page controller*/
    .controller('AboutPage', ['$scope', function ($scope) {
    }]);

