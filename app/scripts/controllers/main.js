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
          serviceAjax.path("sales").then(function(data){
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
        $
        $scope.showDialog = function(value){
          console.log('Value is', value);
          $('#myModal').modal('show');
          $scope.nbPlace = value.nbPlace;
          $scope.nameEvent = value.attributes.name;
        }
       
        /*var loadItems = function(url){
            $scope.loading = true;
            console.log(url);
            //var url= data.data.data.relationships.items.links.related;
          serviceAjax.url(url).then(function(data){
                console.log("Poulet2",data.data.data);
                $scope.items = data.data.data;
                $scope.loading = false;

            });
        };

        $scope.pageChanged = function(){
            loadItems();
        };
        loadItems();*/
       
        $scope.loadItemSpecification = function(sale){
            $scope.loading = true;
            console.log(sale);
            //var url= data.data.data.relationships.items.links.related;
          serviceAjax.url("http://localhost:8000/items/"+sale.id+"/itemspecifications/").then(function(data){
                console.log("Poulet3",data.data.data);
                console.log("Poulet4",data.data.included);
                sale.__items = data.data.data;
                $scope.items3 = data.data.included;
                $scope.loading = false;
                $scope.getPlaceName = function(id){
                    data.data.included.filter(e => {
                      console.log("id "+id);
                      console.log("e.id "+e.id);
                      console.log("e.name"+e.attributes.name);
                      if (e.id==id){return e.attributes.name; 
                        console.log("ok");}
                          
                    });
                  };
                  sale.__showMore = true;
                

            });
        };
        
        
        // // $scope.pageChanged = function(){
        //     loadItemSpecification();
        // };
        // loadItemSpecification();

        
});
/*var app = angular.module('woollyFrontApp')
        app.controller('MyController', function ($scope) {
            //This will hide the DIV by default.
            $scope.IsVisible = false;
            $scope.IsHidden= true;
            $scope.ShowHide = function () {
                //If DIV is visible it will be hidden and vice versa.
                $scope.IsVisible = $scope.IsVisible ? false : true;
                $scope.IsHidden = $scope.IsHidden ? false : true;
            }
            $scope.nbPlace=2; 
            console.log($scope.nbPlace);
            $scope.PlaceExterieur=0; 
            $scope.getNbPlace = function(){
              return ($scope.nbPlace); 
                
            };
            $scope.getPrice = function(){
              return $scope.price;    
            };
            
        });*/
