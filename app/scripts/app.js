'use strict';

/**
 * @ngdoc overview
 * @name woollyFrontApp
 * @description
 * # woollyFrontApp
 *
 * Main module of the application.
 */
angular
  .module('woollyFrontApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/mon_compte', {
        templateUrl: 'views/mon_compte.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/billetterie', {
        templateUrl: 'views/billetterie.html',
        controller: 'BilletterieCtrl',
        controllerAs: 'billetterie'
      })
      /*.when('/mon_compte', {
        templateUrl: 'views/mon_compte.html',
        controller: 'Mon_compteCtrl',
        controllerAs: 'mon_compte'
      })*/
      .otherwise({
        redirectTo: '/'
      });
  });
