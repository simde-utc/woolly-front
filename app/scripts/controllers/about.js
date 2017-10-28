'use strict';

/**
 * @ngdoc function
 * @name woollyFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the woollyFrontApp
 */
angular.module('woollyFrontApp')
  .controller('AboutCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
angular.module('woollyFrontApp')
  .controller('AboutCtrl', function ($scope, serviceAjax) {
        var loadOrders = function(){
            $scope.loading = true;
          serviceAjax.path("orders").then(function(data){
                console.log("Orders",data.data.data);
                console.log("status:",data.data.data.attributes);
                /*if(data.data.data.attributes.status=="awaiting_validation"){
                	data.data.data.attributes.status="A payer";
                	console.log(data.data.data.attributes.status);
                }*/
                $scope.orders = data.data.data;

                $scope.loading = false;

            });
        };

        $scope.pageChanged = function(){
            loadOrders();
        };
        loadOrders();
        
});