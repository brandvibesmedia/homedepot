'use strict';

var ccModule = angular.module( 'cc.main', ['cc.ccService'] );

ccModule.controller( 'CurrencyCtrl', ['$scope', '$timeout', 'ccService',
    function($scope, $timeout, ccService) {
        $scope.formObj = {
            fromCur: 'CAD',
            fromAmount: 1,
            toCur: 'USD'
        };

        $scope.formObj.toAmount = 0;

        function convert() {
            ccService.convert( $scope.formObj ).then( function(res) {
                var amount = $scope.formObj.fromAmount * res.rate;
                amount = amount.toFixed( 2 );
                $scope.formObj.toAmount = amount;
            } );
        }


        $scope.update = function() {
            convert();
        };

        $scope.switcher = false;
        $scope.toggleModal = function(switcher) {
            $scope.switcher = switcher;
            document.getElementById( "modal-disclaimer" ).classList.toggle( "visible", switcher );

        }

    }
] );
