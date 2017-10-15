'use strict';

/**
 * @ngdoc service
 * @name woollyFrontApp.serviceAjax
 * @description
 * # serviceAjax
 * Factory in the woollyFrontApp.
 */
angular.module('woollyFrontApp')
  .factory('serviceAjax', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
angular.module('woollyFrontApp')
  .factory('serviceAjax', function serviceAjax($http) {
    return{
        sales: function(page){
            return $http.get("http://localhost:8000/sales");
        }
    }
  });