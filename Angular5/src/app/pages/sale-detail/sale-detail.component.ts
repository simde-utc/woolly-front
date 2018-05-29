import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonApiQueryData } from 'angular2-jsonapi';
import { JsonApiService } from '../../models/json-api.service';
import { Sale, Item } from '../../models/sale';

@Component({
	selector: 'app-sale-detail',
	templateUrl: './sale-detail.component.html'
})
export class SaleDetailComponent {
	sale: Sale;
	loading: boolean = true;
	cart = {};

	constructor(
		private jsonApiService: JsonApiService,
		private route: ActivatedRoute
	) {
		this.getSale(this.route.snapshot.params.id);
	}

	getSale(id) {
		this.jsonApiService.findRecord(Sale, id, { include: 'items' }).subscribe(
			(sale: Sale) => {
				this.sale = sale
				this.initCart()
			},
			err => console.warn(err),
			() => this.loading = false
		);
	}

	private initCart() : void {
		this.cart = {};
		this.sale.items.forEach((item: Item) => this.cart[item.id] = 0)
	}

	buy() {

	}
}
