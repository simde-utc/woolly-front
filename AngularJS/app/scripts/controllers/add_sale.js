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
		var addSale = function(){
			var data=
			{
				"data": {
					"type": "sales",
					"id": null,
					"attributes": {
						"name": "Test",
						"description": "Soirée pour fêter les vacances.",
						"creation_date": "2017-06-05",
						"begin_date": "2017-06-05",
						"end_date": "2018-06-30",
						"max_payment_date": "2017-06-30",
						"max_item_quantity": 400
					}
				}
			};
			serviceAjax.urlPost("http://localhost:8000/sales/",data).then(function(data){
				console.log("Poulet",data);
			});
		};

		addSale();
	});