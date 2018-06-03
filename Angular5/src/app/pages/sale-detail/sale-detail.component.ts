import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonApiQueryData } from 'angular2-jsonapi';
import { JsonApiService } from '../../models/json-api.service';
import { Sale, Item, Order, OrderLine } from '../../models/sale';

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
		private route: ActivatedRoute,
		private router: Router
	) {
		this.getSale(this.route.snapshot.params.id);
	}

	getSale(id) {
		this.jsonApiService.findRecord(Sale, id, { include: 'items' }).subscribe(
			(sale: Sale) => {
				this.sale = sale
				this.initCart()
			},
			err => {
				console.log("*******************************")
				this.router.navigate['/ventes']
			},
			() => this.loading = false
		);
	}

	private initCart() : void {
		this.cart = {};
		this.sale.items.forEach((item: Item) => this.cart[item.id] = { item: item, quantity: 0 })
	}

	buy() {
		// Create order ??
		let order: Order = this.jsonApiService.createRecord(Order, {
			'sale': this.sale,
		});
		console.log(order)
		order.save().subscribe(o => console.log(o));
		// Add orderlines
		/*
		let orderlines: OrderLine[] = [];
		for (let i in this.cart) {
			let orderline = this.jsonApiService.createRecord(OrderLine, {
				item: this.cart[i].item,
				quantity: this.cart[i].quantity,
				order: order.id
			});
			orderline.save().subscribe(o => console.log(o));
			orderlines.push(orderline);
		}
		*/

	}
}
