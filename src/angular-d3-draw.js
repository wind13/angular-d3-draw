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
                    $scope.MIN_FONT_SIZE = 12;
                    $scope.MAX_FONT_SIZE = 48;
                    $scope.PADDING = 10;
                    $scope.lines = function() {
                        console.log("width:" + $scope.width + ";");
                        console.log("fontsize:" + $scope.fontsize() + ";");
                        var zs = $scope.width / $scope.fontsize() * 2;
                        console.log("zs:" + zs + ";");
                        var ls = Math.floor($scope.textcount / zs);
                        console.log("ls:" + ls + ";");
                        return ls;
                    };
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
                    $scope.fontsize = function() {
                        $scope.textcount = $scope.text.length; //TODO check Chinese char to 2*l;
                        console.log("textcount:" + $scope.textcount + ";");
                        console.log("mj:" + $scope.width * $scope.height + ";");
                        var zmj = Math.sqrt($scope.width * $scope.height / $scope.textcount);
                        console.log("zmj:" + zmj + ";");
                        var fz = Math.round(zmj);
                        console.log("fz:" + fz + ";");
                        console.log("fz:" + fz + ";");
                        return Math.min(fz, $scope.MIN_FONT_SIZE);
                    };
                    $scope.lineheight = function() {
                        return Math.floor(($scope.height - $scope.PADDING) / $scope.lines());
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
                    //  height: inherit; overflow: hidden;
                    // font-size: " + scope.fontsize() + "px;
                    // line-height: " + scope.lineheight() + "px; 
                    style.text(".rectText { text-align: center; padding: " + scope.PADDING + "px; box-sizing: border-box;}" +
                        " .rectStyle { fill: #f60; stroke: black; stroke-width: 5; opacity: 0.3 }");
                    var div = fob.append("xhtml:div");
                    div.attr("id", g.attr("id") + "text");
                    div.attr("class", "rectText " + attr.textClass);
                    div.attr("title", attr.text);
                    div.attr("data-fittext", "");
                    div.text(attr.text);
                    console.log($(div[0]).height());
                    scope.$watch('text', function(newValue, oldValue) {
                        var divtext = d3.select("#" + scope.id + "text");
                        divtext.style({
                            "overflow": "display",
                            "height": "auto"
                        });
                        divtext.text(newValue);
                        var hdiv = $(div[0]).height() + scope.PADDING * 2;
                        var hrct = parseInt(rct.attr("height"));
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
                            while (hdiv > hrct) {
                                if (lhn <= fzn * 1.5 && fzn >= scope.MIN_FONT_SIZE + 2) {
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
                                        return;
                                    } else {
                                        lhn = lhn - 1;
                                        divtext.style({
                                            "line-height": lhn + "px"
                                        });
                                    }
                                }
                                hdiv = $(div[0]).height() + scope.PADDING * 2;
                            }
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
                        }
                        divtext.attr("title", newValue);
                        /* .style({
                            "font-size": scope.fontsize()+"px",
                            "line-height": scope.lineheight() +"px"
                        }); */
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
