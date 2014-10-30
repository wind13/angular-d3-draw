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
                $scope.ladata.x1 = 90;
                $scope.ladata.y2 = 290;
            };

            //TODO check radius less than half of height.
            $scope.rrr01 = {
                "x": "50",
                "y": "30",
                "width": "260",
                "height": "40",
                "radius": "20"
            };
            $scope.changeRRR01 = function() {
                $scope.rrr01.x = 90;
                $scope.rrr01.y = 290;
            };
            $scope.testNum = 1;
            $scope.addZeros = function(lgth){
                // return (lgth === 0)? "":($scope.addZeros(lgth-1) + "0");
                var z="";
                for (var i = 0; i < lgth; i++) {
                    z = z + "0";
                }
                return z;
            };
 

        }
    ]);
