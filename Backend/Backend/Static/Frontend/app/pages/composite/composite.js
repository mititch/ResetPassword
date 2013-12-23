'use strict';

/**
 * Configures 'composite' page route and provide the page controller
 */

angular.module('myApp.pages.composite', [])

    // in other module
    .controller('layoutCtrl', ['$scope', 'Initializer', 'contentPageUrl',
        function ($scope, Initializer, contentPageUrl) {

            if (!Initializer.isReady())
            {
                $scope.pageUrl = 'pages/composite/loading-page.html'
                Initializer.whenReady().then(function () {
                    $scope.pageUrl = contentPageUrl;
                })
            } else {
                $scope.pageUrl = contentPageUrl;
            }

        }
    ])

    .config(['$routeProvider', function ($routeProvider) {
        // Configure route for this page
        $routeProvider.when('/composite', {
            templateUrl: 'pages/composite/layout.html',             // 1
            controller: 'pageCtrl',
            resolve : {
                contentPageUrl :
                    function () { return 'pages/composite/content-page.html'; },    // 2
                someCustomPageData :
                    function () { return 'someData'; }
            }
        });
    }])

    /* Page controller*/
    .controller('pageCtrl', ['$scope', '$controller', 'Initializer',
        'CriticalData', 'contentPageUrl',
        function ($scope, $controller, Initializer, CriticalData, contentPageUrl) {

            // 3
            $controller('layoutCtrl',
                {$scope: $scope, Initializer: Initializer, contentPageUrl: contentPageUrl });

            // Do some basic work

            Initializer.whenReady().then(function () {

               // Do some work with critical data
                $scope.data = CriticalData.get();
            });

        }
    ]);

