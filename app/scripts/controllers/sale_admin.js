'use strict';

/**
 * @ngdoc function
 * @name woollyFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the woollyFrontApp
 */
angular.module('woollyFrontApp')
  .controller('Sale_adminCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
  angular.module('woollyFrontApp')
  .controller('Sale_adminCtrl', function ($scope,$routeParams,serviceAjax) {
        var id = $routeParams.id;  
        console.log(id);

        var loadSales = function(){
          $scope.loading = true;
          serviceAjax.path("sales/"+id).then(function(data){
                console.log("Poulet",data.data.data);
                $scope.sale = data.data.data;

                $scope.loading = false;

            });
        };

        $scope.pageChanged = function(){
            loadSales();
        };
        loadSales();

        var loadItems = function(){
            $scope.loading = true;
            
          serviceAjax.url("http://localhost:8000/items/"+id).then(function(data){
                console.log("Poulet2",data.data.data);
                $scope.items = data.data.data;
                $scope.loading = false;
                
                

            });
        };

        $scope.pageChanged = function(){
            loadItems();
        };
        loadItems();

        var loadItemsBis = function(){
            $scope.loading = true;
            
          serviceAjax.url("http://localhost:8000/items/"+id).then(function(data){
                console.log("Poulet2",data.data.data);
                $scope.itemsBis = data.data.data;
                $scope.loading = false;
                var stat = (1-(data.data.data.attributes.remaining_quantity / data.data.data.attributes.initial_quantity))*100;
                Math.round(stat*100)/100;
                $scope.statPlace = Math.round(stat*100)/100;
                $scope.placeRestante = data.data.data.attributes.initial_quantity-(data.data.data.attributes.remaining_quantity);
                console.log("stat : "+ stat);
                if(data.data.data.attributes.remaining_quantity>0){
                        setTimeout(loadItemsBis, 1000);}
            });
        };

        loadItemsBis();

        

});
