'use strict';

/**
 * @ngdoc function
 * @name woollyFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the woollyFrontApp
 */
angular.module('woollyFrontApp')
  .controller('SaleCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
  angular.module('woollyFrontApp')
  .controller('SaleCtrl', function ($scope,$routeParams,serviceAjax) {
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
        var loadItemSpecification = function(){
            $scope.loading = true;
            
          serviceAjax.url("http://localhost:8000/items/"+id+"/itemspecifications").then(function(data){
                
                //$scope.itemSpecification = data.data.data;
                $scope.loading = false;
                $scope.itemSpecification = data.data.data;
                console.log("Poulet3",$scope.itemSpecification);
            });
        };

        $scope.pageChanged = function(){
            loadItemSpecification();
        };
        loadItemSpecification();
            
        /*var loadAsso = function(){
            $scope.loading = true;
            console.log(url);
          serviceAjax.url("http://assos.utc.fr/profile/obledaym/json").then(function(data){
                console.log("Poulet2",data.data.data);
                $scope.asso = data.data.data;
                $scope.loading = false;

            });
        };

        $scope.pageChanged = function(){
            loadAsso();
        };
        loadAsso();*/

});
