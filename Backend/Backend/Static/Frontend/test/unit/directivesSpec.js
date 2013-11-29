'use strict';

/* jasmine specs for directives go here */

describe('directives', function () {
    beforeEach(module('myApp.directives'));

    var $rootScope;     //root scope object reference
    var $compile;       //compile function reference
    var validTemplate;    //object with default data
    var defaultData;    //object with default data

    function createDirective(data, template) {

        // Setup scope state
        $rootScope.data = data || defaultData;

        // Create directive element
        var element = angular.element(template || validTemplate);

        // Create directive
        $compile(element)($rootScope);

        // Trigger watchers
        $rootScope.$apply();

        // Return
        return element;
    }

    beforeEach(function () {

        // Provide any mocks needed
        module(function ($provide) {
            //$provide.value('Name', new MockName());
        });

        // Inject in angular and module constructs
        inject(function (_$rootScope_, _$compile_) {
            $rootScope = _$rootScope_.$new();
            $compile = _$compile_;
        });

    });

});