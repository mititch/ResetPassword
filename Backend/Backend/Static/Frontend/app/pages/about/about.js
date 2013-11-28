'use strict';

/**
 * Created by mititch on 26.11.13.
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