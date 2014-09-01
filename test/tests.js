describe('ngD3', function () {
  it('should not bleed into the global scope', function () {
    var $injector = angular.injector(['ngD3']);
    expect(window.d3).toBe(undefined);
  });

  it('should have versioning: 3.4.8', function () {
    var $injector = angular.injector(['ngD3']);
    var $d3 = $injector.get('$d3');
    expect($d3.version).toBe('3.4.8');
  });
});
/*
describe('angular-d3-draw', function () {
  it('should not bleed into the global scope', function () {
    var $injector = angular.injector(['angular-d3-draw']);
    expect(window.d3).toBe(undefined);
  });

  it('should have versioning: 0.0.1', function () {
    var $injector = angular.injector(['angular-d3-draw']);
    // var $d3draw = $injector.get('$ngd3draw');
    // expect($d3draw.version).toBe('0.0.1');
    expect(1).toBe(1);
  });
});
*/
