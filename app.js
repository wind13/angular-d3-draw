angular.module('examples', ['angular-d3-draw'])
    .controller('main', ['$scope',
        function($scope) {
            $scope.d3text = "This is a great text test!";
            if (d3) $scope.d3 = d3;

            $scope.ladata = {
                "x1": "50",
                "y1": "30",
                "x2": "260",
                "y2": "40"
            };
            $scope.pointArrow = function() {
                $scope.ladata.y2 = 90;
            };
        }
    ]);
