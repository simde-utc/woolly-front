'use strict';

/**
 * @ngdoc function
 * @name woollyFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the woollyFrontApp
 */
angular.module('woollyFrontApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
angular.module('woollyFrontApp')
  .controller('MainCtrl', function ($scope, serviceAjax) {
        var loadSales = function(){
            $scope.loading = true;
          serviceAjax.sales("sales")
          .then(function(data){
                console.log("Poulet",data.data.data);
                $scope.next_sales = data.data.data.filter(e => {
                  return ((new Date(e.attributes.end_date)).getTime() > Date.now());
                });
                $scope.sales = data.data.data;
                $scope.loading = false;

            });
        };

        $scope.pageChanged = function(){
            loadSales();
        };
        loadSales();

        
});