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
      .when('/billetterie', {
        templateUrl: 'views/billetterie.html',
        controller: 'BilletterieCtrl',
        controllerAs: 'billetterie'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
