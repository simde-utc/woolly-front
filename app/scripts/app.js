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
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/mon_compte', {
        templateUrl: 'views/mon_compte.html',
        controller: 'Mon_compteCtrl',
        controllerAs: 'mon_compte'
      })
      .when('/billetterie', {
        templateUrl: 'views/billetterie.html',
        controller: 'BilletterieCtrl',
        controllerAs: 'billetterie'
      })
      .when('/add_sale', {
        templateUrl: 'views/add_sale.html',
        controller: 'Add_saleCtrl',
        controllerAs: 'add_sale'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'admin'
      })
      .when('/sale/:id', {
        templateUrl: 'views/sale.html',
        controller: 'SaleCtrl',
        controllerAs: 'sale'
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
