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
                return $http.get( 'http://api.fixer.io/latest?base=' + req.fromCur + '&symbols=' + req.toCur );
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
