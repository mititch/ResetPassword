'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['myApp.resources'])
    .value('version', '0.1')
    .factory('Password', ['passwordResource', function (passwordResource) {
        return passwordResource('password');
    }]);
