'use strict';

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;

}
/**
 * @ngdoc service
 * @name woollyFrontApp.serviceAjax
 * @description
 * # serviceAjax
 * Factory in the woollyFrontApp.
 */
 var csrftoken =  getCookie('csrftoken');

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
        },
        urlPost: function(url, data){
            return $http.post(url, data, {withCredentials:true, headers: {'Content-Type': 'application/vnd.api+json',"X-CSRFToken": csrftoken}});
        }
        
    }
  });