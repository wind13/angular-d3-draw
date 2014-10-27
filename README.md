AngularJS D3 Draw
===============

Use AngularJS and D3 to implement component like Draw of LibreOffice.

You can create often used svg vector image/component like Draw of LibreOffice on web page using angular-d3-draw.

## How to use

### Install

Install it via bower(not done yet):
	
    $ bower install angular-d3-draw
	

### Usage

Add dependencies to the `<head>` section of your index html:
```html
<meta charset="utf-8">  <!-- it's important for d3.js -->
<link rel="stylesheet" href="bower_components/angular-d3-draw/build/css/angular-d3-draw.css">
<script src="bower_components/jquery/dist/jquery.js"></script>
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/d3/d3.js"></script>
<script src="bower_components/angular-d3-draw/build/angular-d3-draw.min.js"></script>
```

Then in angular page you can use it like:
```html
<div style="width: 600px; height: 500px">
    <svg id="drawSvg" width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>
</div>
<svg-adaptor svgid="drawSvg" ng-transclude>
    <rect-text id="svgtext" x="50" y="50" rx="20" ry="50" width="100" height="50" style="fill:#fc0;"
    text-class="textCss" rect-class="rectCss" text="This is a rect text component."></rect-text>
    <right-rounded-rect x="50" y="260" width="300" height="200" radius="100"></right-rounded-rect>
</svg-adaptor>
```

Note: the *svg id* should same as *svgid* attribute.

### Directives

#### Rect text

A rect with text inside.

#### Right rounded rect

A right rounded rect.

## Examples

* [TOC Cloud Diagram](http://www.playscala.com/example/jsui/toc-tools/#/cloud)

## Inspiration & Ideas

* [angular-nvd3](https://github.com/krispo/angular-nvd3)
* [angular-d3-directives](https://github.com/kontera-technologies/angular-d3-directives)
