'use strict';

/* Services */

angular.module('myApp.services', [])

    .provider('apiUrl', function() {

        this.baselUrl = '';

        this.$get = function() {
            return {
                baselUrl : this.baselUrl
            };
        };

        this.setBaseUrl = function(baselUrl) {
            this.baselUrl = baselUrl;
        };
    })

    .factory('Password', ['passwordResource', function (passwordResource) {

        return passwordResource('password');

    }])

    .factory('notificationsStorage', function () {

        return {
            notifications: [{type: 'info', text: "Application started"}],

            add:function (type, text) {
                if (this.notifications.length > 2) {
                    this.remove(0);
                }
                this.notifications.push(
                    {type: type, text: text}
                );
            },

            remove : function (index) {
                this.notifications.splice(index, 1);
            }
        };
    });
