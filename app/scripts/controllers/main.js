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
            serviceAjax.sales($scope.currentPage).success(function(data){
                $scope.sales = data.results;
                $scope.loading = false;
            });
        };

        $scope.pageChanged = function(){
            loadSales();
        };
        loadSales();
  });