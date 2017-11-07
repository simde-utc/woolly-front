'use strict';

/**
 * @ngdoc function
 * @name woollyFrontApp.controller:Add_saleCtrl
 * @description
 * # Add_saleCtrl
 * Controller of the woollyFrontApp
 */
angular.module('woollyFrontApp')
  .controller('Add_saleCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

angular.module('woollyFrontApp')
  .controller('Add_saleCtrl', function ($scope,$routeParams,serviceAjax) {
        var fun_id = $routeParams.id; 
        console.log(fun_id);
});