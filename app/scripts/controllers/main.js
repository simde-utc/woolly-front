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
                  var endDate = new Date(e.attributes.end_date);
                  var beginDate = new Date(e.attributes.begin_date);
                  return ((endDate.getTime() > Date.now()) && (beginDate.getTime() < Date.now()));
                });
                $scope.sales = data.data.data;

                $scope.loading = false;
                
            });
        };

       
        loadSales();
        $
        $scope.showDialog = function(value){
          console.log('Value is', value);
          $('#myModal').modal('show');
          value.filter(e => {
            console.log(e.nbPlace);
                  $scope.nbPlace = e.nbPlace;
                  
                });
          //$scope.nbPlace = value.nbPlace;
          //$scope.nameEvent = value.attributes.name;
        }
       
        $scope.createTransaction = function(nbPlace){
            
            //var url= data.data.data.relationships.items.links.related;
            // serviceAjax.urlPost("localhost:8000/payutc/createTransaction/").then(function(data){
            //     console.log("Poulet2",data.data);
                

            // });
          //var data = '[[3933,2],[23232,3]]';
          console.log(nbPlace);
          var data = JSON.stringify([[9633,nbPlace]]);
          console.log("poulet",data);
          serviceAjax.urlPost("http://localhost:8000/payutc/createTransaction?mail=obled.aymeric@gmail.com&funId=38",data).then(function(data){
                 data = JSON.parse(JSON.stringify(data));
          //       console.log("hi")
                 console.log(data.data.url);
            //     console.log("hj")
                document.location.href = data.data.url;

                

            });
          // var xsrf = $.param({fkey: "key"});
          // $http({
          //     method: 'POST',
          //     url: url,
          //     data: xsrf,
          //     headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          // })
        };

        
       
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
