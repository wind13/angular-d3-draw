angular.module('examples', ['angular-d3-draw'])
    .controller('main', ['$scope',
        function($scope) {
            $scope.d3text = "This is a great text test!";
            if (d3) $scope.d3 = d3;
        }
    ]);
