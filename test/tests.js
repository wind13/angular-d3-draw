describe('angular-d3-draw test suits', function() {
    var $compile;
    var $rootScope;
    var testsvg;

    // Load the module, which contains the directive
    beforeEach(module('angular-d3-draw'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        testsvg = $('<svg id="testsvg" width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>');
        $('body').html('<div style="width: 1000px; height: 800px"></div>')
            .find('div')
            .append(testsvg);
    }));


    it('should have d3 global', function() {
        expect(window.d3.version).toBe('3.4.11');
    });

    it('should replaces the element with the appropriate content', function() {
        // Compile a piece of HTML containing the directive
        var element = $compile("<svg-adaptor></svg-adaptor>")($rootScope);
        // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
        $rootScope.$digest();
        // Check that the compiled element contains the templated content
        expect(element[0].outerHTML).toBe("<svg-adaptor class=\"ng-scope ng-isolate-scope\"></svg-adaptor>");
        expect(element[0].tagName).toBe(angular.uppercase("svg-adaptor"));
    });

    it('should create svg right rounded rect component in html', function() {
        var element = $compile('<svg-adaptor svgid="testsvg" ng-transclude>' +
            '<right-rounded-rect x="50" y="260" width="300" height="200" radius="100" class="rrr"></right-rounded-rect>' +
            '</svg-adaptor>')($rootScope);
        // In PhantomJS or Firefox, browser can not get the innerHTML of svg element.
        // var jqsvg = jQuery("#testsvg");
        // console.debug(jqsvg.html());
        var jqdiv = jQuery("div:first");
        console.debug(jqdiv.html());
        console.debug(jqdiv.html().indexOf("path"));
        expect(jqdiv.html().indexOf("path")).toBeGreaterThan(10);

        var gd3 = d3.select("#testsvg g path");
        console.debug(gd3.attr("class"));
        expect(gd3.attr("class")).toEqual("rrr");

        console.debug(testsvg.width());
        console.debug(testsvg.height());
        expect(testsvg.get(0).tagName).toBe('svg');
        expect(testsvg.width()).toEqual(1000);
        expect(testsvg.height()).toBe(800);
        $('body').empty();
    });

    it('should create svg rect text component in html', function() {
        var element = $compile('<svg-adaptor svgid="testsvg" ng-transclude>' +
            '<rect-text id="rt" x="50" y="50" rx="20" ry="50" width="200" height="150" style="fill:#fc0;"' +
            'text-class="test" rect-class="great" text="This is a great text test!"></rect-text>' +
            '</svg-adaptor>')($rootScope);
        var jqdiv = jQuery("div:first");
        console.debug(jqdiv.html());
        console.debug(jqdiv.html().indexOf("rect"));
        expect(jqdiv.html().indexOf("rect")).toBeGreaterThan(10);
        console.debug(jqdiv.html().indexOf("div"));
        expect(jqdiv.html().indexOf("div")).toBeGreaterThan(10);

        // var divt = d3.select("#testsvg g foreignObject div");
        var divt = d3.select("#testsvg g div");
        console.debug(divt.attr("id"));
        expect(divt.attr("id")).toBe("rttext");

        var rect = d3.select("#testsvg rect");
        console.debug(rect.attr("id"));
        expect(rect.attr("id")).toEqual("rtrect");

        $('body').empty();
    });

    it('should create svg arrow component in html', function() {
        var element = $compile('<svg-adaptor svgid="testsvg" ng-transclude>' +
            '<link-arrow data=\'{x1:"50",y1:"30",x2:"260",y2:"40"}\' class="linkarrow"></link-arrow>' +
            '</svg-adaptor>')($rootScope);
        var jqdiv = jQuery("div:first");
        console.debug(jqdiv.html());
        console.debug(jqdiv.html().indexOf("line"));
        expect(jqdiv.html().indexOf("line")).toBeGreaterThan(10);
        console.debug(jqdiv.html().indexOf("marker"));
        expect(jqdiv.html().indexOf("marker")).toBeGreaterThan(10);
        var gd3 = d3.select("#testsvg line");
        console.debug(gd3.attr("class"));
        $('body').empty();
    });
});
