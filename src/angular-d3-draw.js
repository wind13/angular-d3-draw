(function() {
    'use strict';
    angular.module('angular-d3-draw', [])
        .directive('svgAdaptor', function() {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    'svgid': '@'
                },
                controller: function($scope) {
                    $scope.svg = d3.select("#" + $scope.svgid);
                    this.draw = function(id, x, y) {
                        var g = $scope.svg.append("g");
                        g.attr("id", id).attr("transform", "translate(" + x + "," + y + ")");
                        return g;
                    };
                },
                link: function(scope, element, attr) {}
            };
        })
        .directive('rectText', function() {
            return {
                restrict: 'E',
                transclude: true,
                require: '^svgAdaptor',
                scope: {
                    id: '@',
                    text: '@',
                    width: '@',
                    height: '@',
                    x: '@',
                    y: '@',
                    rx: '@',
                    ry: '@',
                    style: '@',
                    textClass: '@',
                    rectClass: '@'
                },
                controller: function($scope) {
                    $scope.padding = 10;
                    $scope.lines = function() {
                        console.log("width:" + $scope.width + ";");
                        console.log("fontsize:" + $scope.fontsize() + ";");
                        var zs = $scope.width / $scope.fontsize() * 2;
                        console.log("zs:" + zs + ";");
                        var ls = Math.floor($scope.textcount / zs);
                        console.log("ls:" + ls + ";");
                        return ls;
                    };
                    $scope.fontsize = function() {
                        $scope.textcount = $scope.text.length; //TODO check Chinese char to 2*l;
                        console.log("textcount:" + $scope.textcount + ";");
                        console.log("mj:" + $scope.width * $scope.height + ";");
                        var zmj = Math.sqrt($scope.width * $scope.height / $scope.textcount);
                        console.log("zmj:" + zmj + ";");
                        var fz = Math.round(zmj);
                        console.log("fz:" + fz + ";");
                        return fz;
                    };
                    $scope.lineheight = function() {
                        return Math.floor(($scope.height - $scope.padding) / $scope.lines());
                    };
                },
                link: function(scope, element, attr, svgCtrl) {
                    console.debug("attr.id:" + attr.id + ";");
                    console.debug("scope.id:" + scope.id + ";");
                    var g = svgCtrl.draw(scope.id, scope.x, scope.y);
                    var rct = g.append("rect");
                    rct.attr("id", g.attr("id") + "rect");
                    rct.attr("rx", attr.rx);
                    rct.attr("ry", attr.ry);
                    rct.attr("width", attr.width);
                    rct.attr("height", attr.height);
                    rct.attr("style", attr.style);
                    rct.attr("class", "rectStyle " + attr.rectClass);
                    var fob = g.append("foreignObject");
                    fob.attr("width", attr.width);
                    fob.attr("height", attr.height);
                    var style = fob.append("xhtml:style");
                    style.text(".rectText { text-align: center; font-size: " + scope.fontsize() +
                        "px; padding: " + scope.padding + "px; box-sizing: border-box; line-height: " +
                        scope.lineheight() + "px; height: inherit; overflow: hidden; }" +
                        " .rectStyle { fill: #f60; stroke: black; stroke-width: 5; opacity: 0.3 }");
                    var div = fob.append("xhtml:div");
                    div.attr("id", g.attr("id") + "text");
                    div.attr("class", "rectText " + attr.textClass);
                    div.attr("title", attr.text);
                    div.text(attr.text);
                    scope.$watch('text', function(newValue, oldValue) {
                        d3.select("#" + scope.id + "text").text(newValue).style({
                            "font-size": scope.fontsize()+"px",
                            "line-height": scope.lineheight() +"px"
                        });
                    });
                }
            };
        })
        .directive('rightRoundedRect', function() {
            return {
                restrict: 'E',
                transclude: true,
                require: '^svgAdaptor',
                scope: {
                    id: '@',
                    width: '@',
                    height: '@',
                    x: '@',
                    y: '@',
                    radius: '@',
                    style: '@',
                    class: '@'
                },
                controller: function($scope) {
                    $scope.rightRoundedRect = function(x, y, width, height, radius) {
                        return "M" + x + "," + y + "h" + (width - radius) + "a" +
                            radius + "," + radius + " 0 0 1 " + radius + "," +
                            radius + "v" + (height - 2 * radius) + "a" + radius +
                            "," + radius + " 0 0 1 " + -radius + "," + radius +
                            "h" + (radius - width) + "z";
                    };
                },
                link: function(scope, element, attr, svgCtrl) {
                    var g = svgCtrl.draw(attr.id, attr.x, attr.y);
                    var rrr = g.append("path");
                    rrr.attr("style", attr.style);
                    rrr.attr("class", attr.class);
                    rrr.attr("d", scope.rightRoundedRect(0, 0, attr.width, attr.height, attr.radius));
                }
            };
        })
})();
