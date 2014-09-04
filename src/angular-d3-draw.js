(function() {
    'use strict';
    angular.module('angular-d3-draw', [])
        .directive('svgAdaptor', function() {
            return {
                restrict: 'E',
                transclude: true,
                replace: true,
                scope: {
                    'svgid': '@'
                },
                controller: function($scope) {
                    $scope.svg = d3.select("#" + $scope.svgid);
                    this.draw = function(ele) {
                        return $scope.svg.append(ele);
                    };
                },
                link: function(scope, element, attr) {
                    scope.svg.append("rect").attr("x", "5").attr("y", "5").attr("width", "12").attr("height", "20");
                }
            };
        })
        .directive('rectText', function() {
            return {
                restrict: 'E',
                transclude: true,
                require: '^svgAdaptor',
                replace: true,
                scope: {
                    width: '@',
                    height: '@',
                    x: '@',
                    y: '@',
                    rx: '@',
                    ry: '@',
                    style: '@',
                    class: '@'
                },
                controller: function($scope) {},
                link: function(scope, element, attr, svgCtrl) {
                    var ele = svgCtrl.draw("rect");
                    //var ele = svgCtrl.draw("rect");
                    ele.attr("x", attr.x);
                    ele.attr("y", attr.y);
                    ele.attr("width", attr.width);
                    ele.attr("height", attr.height);
                    ele.attr("style", attr.style);
                }
            };
        })
})();
