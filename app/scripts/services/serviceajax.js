'use strict';

/**
 * @ngdoc service
 * @name woollyFrontApp.serviceAjax
 * @description
 * # serviceAjax
 * Factory in the woollyFrontApp.
 */
angular.module('woollyFrontApp')
  .factory('serviceAjax', function serviceAjax($http) {
    return{
        sales: function(page){
            return $http.get("http://localhost:8000/sales", {withCredentials:true});
        },
        path: function(path){
            return $http.get("http://localhost:8000/"+path, {withCredentials:true});
        },
        url: function(url){
            return $http.get(url, {withCredentials:true});
        }
    }
  });