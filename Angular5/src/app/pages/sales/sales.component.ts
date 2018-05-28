import { Component } from '@angular/core';
import { JsonApiQueryData } from 'angular2-jsonapi';
import { JsonApiService } from '../../models/json-api.service';
import { Sale } from '../../models/sale';

// TODO Animations
import { trigger, state, style, animate,transition } from '@angular/animations';


@Component({
	selector: 'app-sales',
	templateUrl: './sales.component.html',
	animations: [
		trigger('fullCard', [
			state('true', style({
				backgroundColor: '#777',
				height: 500
			})),
			transition('void => true', animate('10s ease-in'))
		])
	]
})
export class SalesComponent {
	sales: Sale[];

	constructor(private jsonApiService: JsonApiService) {
		this.jsonApiService.findAll(Sale, {
			page: { size: 10, number: 1 },
		}).subscribe(
			(sales: JsonApiQueryData<Sale>) => console.log(sales.getModels())
		);
	}

}
