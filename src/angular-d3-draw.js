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
                    this.svg = $scope.svg = d3.select("#" + $scope.svgid);
                    this.gid = function(id) {
                        return $scope.svgid + "-" + id;
                    };
                    this.find = function(id) {
                        return d3.select("#" + this.gid(id));
                    };
                    this.group = function(id, x, y) {
                        var g = $scope.svg.append("g");
                        g.attr("id", id).attr("transform", "translate(" + x + "," + y + ")");
                        return g;
                    };

                    /**
                     * Used for sub element watch attrs change.
                     *
                     * @svgCtrl just means this controller
                     * @scope the sub element scope
                     * @attr the sub element attr
                     * @fnSet the function to handle the attr changes.
                     *
                     */
                    this.watchAttrs = function(svgCtrl, scope, attr, fnSet) {
                        var svgCtrl = this;
                        angular.forEach(attr, function(value, key) {
                            if (key.indexOf("$") < 0) {
                                scope.$watch(key, function(newValue, oldValue) {
                                    fnSet(svgCtrl, scope, key, newValue, oldValue);
                                });
                            }
                        });
                    };

                    /**
                     * Used for sub element set attrs. Can be used for watchAttrs default fnSet.
                     *
                     * @svgCtrl just means this controller.
                     * @scope the sub element scope
                     * @key the attr key
                     * @newValue the new value want to set to attr.
                     * @oldValue the old value of the attr.
                     */
                    this.setAttrs = function(svgCtrl, scope, key, newValue, oldValue) {
                        var v = newValue;
                        if (key === "id") {
                            v = svgCtrl.gid(newValue);
                        }
                        svgCtrl.find(scope.id).attr(key, v);
                    }

                    this.markerArrow = function(id, fill) {
                        var marker = $scope.svg.append('marker');
                        marker.attr("id", this.gid(id));
                        marker.attr("viewBox", "0 0 10 10");
                        marker.attr("refX", "0");
                        marker.attr("refY", "5");
                        marker.attr("fill", fill);
                        marker.attr("markerUnits", "strokeWidth");
                        marker.attr("markerWidth", "8");
                        marker.attr("markerHeight", "6");
                        marker.attr("orient", "auto");
                        var triangle = marker.append('path');
                        triangle.attr("d", "M 0 0 L 10 5 L 0 10 z");
                        return marker;
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
                    $scope.MIN_FONT_SIZE = 12;
                    $scope.MAX_FONT_SIZE = 48;
                    $scope.PADDING = 10;
                    $scope.calculateLineHeight = function(element) {
                        var lineHeight = parseInt($(element).css('line-height'), 10);
                        var clone;
                        var singleLineHeight;
                        var doubleLineHeight;

                        if (isNaN(lineHeight)) {
                            clone = element.cloneNode();
                            clone.innerHTML = '<br>';
                            element.appendChild(clone);
                            singleLineHeight = clone.offsetHeight;
                            clone.innerHTML = '<br><br>';
                            doubleLineHeight = clone.offsetHeight;
                            element.removeChild(clone);
                            lineHeight = doubleLineHeight - singleLineHeight;
                        }

                        return lineHeight;
                    }
                },
                link: function(scope, element, attr, svgCtrl) {
                    var g = svgCtrl.group(scope.id, scope.x, scope.y);
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
                    style.text(".rectText { text-align: center; padding: " + scope.PADDING + "px; box-sizing: border-box;}" +
                        " .rectStyle { fill: #f60; stroke: black; stroke-width: 5; opacity: 0.3 }");
                    var div = fob.append("xhtml:div");
                    div.attr("id", g.attr("id") + "text");
                    div.attr("class", "rectText " + attr.textClass);
                    div.attr("title", attr.text);
                    div.attr("data-fittext", "");
                    div.text(attr.text);
                    scope.$watch('text', function(newValue, oldValue) {
                        var divtext = d3.select("#" + scope.id + "text");
                        divtext.style({
                            "overflow": "display",
                            "height": "auto"
                        });
                        divtext.text(newValue);
                        var hrct = parseInt(rct.attr("height"));
                        // if is empty string, then set the height to avoid infinite loop.
                        if (newValue === "") {
                            divtext.style({
                                "font-size": hrct / 2 + "px",
                                "line-height": hrct + "px",
                                "overflow": "hidden",
                                "height": hrct + "px"
                            });
                            return;
                        }
                        var hdiv = $(div[0]).height() + scope.PADDING * 2;
                        var lh = scope.calculateLineHeight(div[0][0]);
                        var fz = parseInt($(div[0]).css("font-size"));
                        var fzn, lhn;
                        console.log(hdiv + " vs " + hrct);
                        if (hdiv > 0 && hrct > 0 && lh > 0 && fz > 0) {
                            // Set fz and lh not over confine.
                            fzn = Math.max(fz, scope.MIN_FONT_SIZE);
                            fzn = Math.min(fzn, scope.MAX_FONT_SIZE);
                            lhn = Math.min(lh, hrct - scope.PADDING * 2);
                            lhn = Math.max(lhn, fz);
                            if (fzn != fz || lhn != lh) {
                                divtext.style({
                                    "font-size": fzn + "px",
                                    "line-height": lhn + "px"
                                });
                                hdiv = $(div[0]).height() + scope.PADDING * 2;
                            }

                            // Adjust fz and lh to fit the rect.
                            while (hdiv < hrct) {
                                if (fzn >= scope.MAX_FONT_SIZE || lhn < fzn * 1.5) {
                                    lhn = lhn + 1;
                                    divtext.style({
                                        "line-height": lhn + "px"
                                    });
                                } else {
                                    fzn = fzn + 1;
                                    divtext.style({
                                        "font-size": fzn + "px"
                                    });
                                }
                                hdiv = $(div[0]).height() + scope.PADDING * 2;
                            }
                            while (hdiv > hrct) {
                                if (lhn <= fzn * 1.5 && fzn > scope.MIN_FONT_SIZE) {
                                    fzn = fzn - 1;
                                    divtext.style({
                                        "font-size": fzn + "px"
                                    });
                                } else {
                                    if (lhn <= scope.MIN_FONT_SIZE) {
                                        divtext.style({
                                            "overflow": "hidden",
                                            "height": hrct + "px"
                                        });
                                    } else {
                                        lhn = lhn - 1;
                                        divtext.style({
                                            "line-height": lhn + "px"
                                        });
                                    }
                                }
                                hdiv = $(div[0]).height() + scope.PADDING * 2;
                            }
                            if (hdiv != hrct) {
                                lhn = Math.max(scope.MIN_FONT_SIZE, hrct / (hdiv / lhn));
                                divtext.style({
                                    "overflow": "hidden",
                                    "line-height": lhn + "px",
                                    "height": hrct + "px"
                                });
                            }
                        }
                        divtext.attr("title", newValue);
                    });
                }
            };
        })
        .directive('rightRoundedRect', function() {
            return {
                restrict: 'E',
                transclude: false,
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
                    $scope.setAttrs = function(svgCtrl, scope, key, newValue, oldValue) {
                        var path = svgCtrl.find(scope.id);
                        switch (key) {
                            case "id":
                                path.attr(key, svgCtrl.gid(newValue));
                                break;
                            case "style":
                            case "class":
                                path.attr(key, newValue);
                                break;
                            default:
                                path.attr("d", $scope.rightRoundedRect(scope.x, scope.y, scope.width, scope.height, scope.radius));
                        }
                    };

                },
                link: function(scope, element, attr, svgCtrl) {
                    // var g = svgCtrl.group(attr.id, attr.x, attr.y);
                    var rrr = svgCtrl.svg.append("path");
                    rrr.attr("id", svgCtrl.gid(attr.id));
                    // rrr.attr("style", attr.style);
                    // rrr.attr("class", attr.class);
                    // rrr.attr("d", scope.rightRoundedRect(attr.x, attr.y, attr.width, attr.height, attr.radius));
                    svgCtrl.watchAttrs(svgCtrl, scope, attr, scope.setAttrs);
                }
            };
        })
        .directive('linkArrow', function() {
            return {
                restrict: 'E',
                transclude: false,
                require: '^svgAdaptor',
                scope: {
                    id: '@',
                    x1: '@',
                    y1: '@',
                    x2: '@',
                    y2: '@',
                    stroke: '@',
                    strokeWidth: '@',
                    title: '@',
                    class: '@'
                },
                controller: function($scope) {},
                link: function(scope, element, attr, svgCtrl) {
                    var ma = svgCtrl.markerArrow(attr.id + "-arrow", attr.stroke);
                    var rrr = svgCtrl.svg.append("line");
                    rrr.attr("id", svgCtrl.gid(attr.id));
                    rrr.attr("marker-end", "url(#" + ma.attr("id") + ")");
                    svgCtrl.watchAttrs(svgCtrl, scope, attr, svgCtrl.setAttrs);
                }
            }
        })
        /** 
         * Test browser dynamically render svg element.
         */
        .directive('svgHere', function() {
            return {
                restrict: 'EA',
                transclude: true,
                replace: true,
                scope: {
                    'id': '@',
                    'width': '@',
                    'height': '@'
                },
                controller: function($scope) {
                    $scope.svg = d3.select("#" + $scope.id);
                    $scope.svg.append("circle").attr("cx", "50").attr("cy", "40").attr("r", "20");
                },
                template: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>',
                link: function(scope, element, attr) {
                    scope.svg = d3.select("#" + scope.id);
                    scope.svg.append("circle").attr("cx", "50").attr("cy", "40").attr("r", "20");
                }
            };
        })
        .directive('circleTest', function() {
            return {
                restrict: 'E',
                replace: true,
                template: '<rect x="5" y="5" width="20" height="20" class="ng-scope"></rect>'
            };
        })
})();
