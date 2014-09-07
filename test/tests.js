describe('angular-d3-draw test suits', function() {
    var $compile;
    var $rootScope;

    // Load the module, which contains the directive
    beforeEach(module('angular-d3-draw'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));


    it('should have d3 global', function() {
        expect(window.d3.version).toBe('3.4.11');
    });

    it('Replaces the element with the appropriate content', function() {
        // Compile a piece of HTML containing the directive
        var element = $compile("<svg-adaptor></svg-adaptor>")($rootScope);
        // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
        $rootScope.$digest();
        // Check that the compiled element contains the templated content
        expect(element[0].outerHTML).toBe("<svg-adaptor class=\"ng-scope ng-isolate-scope\"></svg-adaptor>");
        expect(element[0].tagName).toBe(angular.uppercase("svg-adaptor"));
    });
    
});
