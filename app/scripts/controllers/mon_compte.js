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

        
$scope.generatePDF= function(order){
  pdf = new PDFDocument
  var pdf = new jsPDF('p', 'pt', 'a4');
  var img = new Image;
  
  var width = pdf.internal.pageSize.width;    
  var height = pdf.internal.pageSize.height;
  img.onload = function() {
      pdf.addImage(this, 0, 0, width, height);
  
  // img_qr.onload = function() {
  //     pdf.addImage(this, 0, 0, width, height);
  //     pdf.save("sale_"+order.id+'.pdf');
  // };

 
  var canvas = document.querySelector("#qrcode canvas");

  
  var pdfImage = canvas.toDataURL('image/jpg');
  console.log("test");
  pdf.addImage(pdfImage, 300, 120);
 pdf.save("sale_"+order.id+'.pdf');
 // img_qr.src ="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example&format=jpeg"; 
  //$scope.qrcode = '<img src="'+img_qr.src+'"/>';
     //pdf.save("sale_"+order.id+'.pdf');
  };
   img.src = "../images/place.jpg";  // some random imgur image
   console.log(order.id);
   var data = JSON.stringify({'username' : 'snastuzz', 'id' : order.attributes.hash_key, 'api':'woolly','command':''});
   console.log("data : ",data);
$('#qrcode').qrcode({
    text  : data
  }); 
};





        
});
