'use strict';

/**
 * @ngdoc function
 * @name woollyFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the woollyFrontApp
 */
angular.module('woollyFrontApp')
  .controller('Mon_compteCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
  angular.module('woollyFrontApp')
  .controller('Mon_compteCtrl', function ($scope,serviceAjax) {
        var loadOrders = function(){
            $scope.loading = true;
          serviceAjax.path("orders").then(function(data){
                console.log("Orders",data.data.data);
                //console.log("status:",data.data.data.attributes.status);
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

        $scope.getStatus = function(order){
            $scope.loading = true;
            console.log("order:",order);
            
                      console.log("order status "+order.attributes.status); 
                      switch(order.attributes.status) {
                      case "awaiting_validation":
                      $scope.button= '<strong>test</strong>';
                          return "En attente de validation";
                          break;
                      case "not_payed":
                          return "Non payé";
                          break;
                      case "payed":
                          return "Payé";
                          break;
                      case "validated":
                          return "Validé";
                          break;
                  } 
        };
 $scope.generatePDF= function(order){
var pdf = new jsPDF('p', 'pt', 'a4');
pdf.text(100, 100, "Place achetée le : "+ order.attributes.date);
pdf.text(100, 120, "Statut de la vente : "+ order.attributes.status);
pdf.rect(85, 80, 300, 100);
pdf.line(0, 250, 1000, 250);
pdf.save("sale_"+order.id+'.pdf');
    
};

        // $scope.getName = function(order){
        //     $scope.loading = true;
        //     console.log(order);
        //     //var url= data.data.data.relationships.items.links.related;
        //   serviceAjax.url("http://localhost:8000/orders/"+order.id+"/orderlines/").then(function(data){
        //         console.log("Poulet3",data.data.included);
               
                
        //             data.data.included.filter(e => {
        //               console.log("name "+e.attributes.name);
        //               return e.attributes.name;
                          
        //             });
                  
                  
                

        //     });
        // };        

       // // $scope.getStatus = function(order){
       //      $scope.loading = true;
       //      console.log(order);
       //      //var url= data.data.data.relationships.items.links.related;
          
                

       //      });
       //  };
        
});
