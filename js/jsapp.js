'use strict';
var appModule = angular.module( 'cc', [
        'cc.ccService'
        , 'cc.main'
    ]
);

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

'use strict';

var serviceModule = angular.module( 'cc.ccService', [] );

serviceModule.factory( "ccService", ['$q', '$timeout', '$http',
    function($q, $timeout, $http) {

        var conv_data = null;

        function convert(req) {
            if(conv_data) {
                $timeout.cancel( conv_data );
            }
            var res = {
                rate: 1,
                desc: 'Subject to change without notice, 15 minutes delayed.'
            };

            conv_data = $timeout( function() {
                return $http.get( 'https://api.fixer.io/latest?base=' + req.fromCur + '&symbols=' + req.toCur );
            }, 100 );

            var calc_data = conv_data.then( function(result) {
                var rates = result.data.rates;
                res.rate = rates[req.toCur];
                return res
            } );

            return calc_data;
        }

        return {
            convert: convert
        };
    }
] );

//# sourceMappingURL=jsapp.js.map
