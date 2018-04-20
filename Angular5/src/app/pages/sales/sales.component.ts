import { Component, OnInit } from '@angular/core';
import { ICollection } from 'ngx-jsonapi';
import { Item, Sale } from '../../models/sale/sale';
import { SaleService } from '../../models/sale/sale.service';

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
export class SalesComponent implements OnInit {
	sales: ICollection<Sale>;

	constructor(private saleService: SaleService) { }

	ngOnInit() {
		this.saleService.all().subscribe(sales => this.sales = sales);
	}

}
