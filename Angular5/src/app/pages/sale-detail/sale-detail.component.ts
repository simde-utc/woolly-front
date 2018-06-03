import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonApiQueryData } from 'angular2-jsonapi';
import { JsonApiService } from '../../models/json-api.service';
import { AuthService } from '../../models/auth.service';
import { Sale, Item, Order, OrderLine } from '../../models/sale';
import { User } from '../../models/user';

@Component({
	selector: 'app-sale-detail',
	templateUrl: './sale-detail.component.html'
})
export class SaleDetailComponent {
	sale: Sale;
	me: User = null;
	order: Order;
	loading: boolean = true;
	cart = {};

	constructor(
		private jsonApiService: JsonApiService,
		private authService: AuthService,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.getSale(this.route.snapshot.params.id);
		this.authService.getUser('').subscribe((user: User) => {this.me = user; console.log(user)})
	}

	private initCart() : void {
		this.cart = {};
		this.sale.items.forEach((item: Item) => this.cart[item.id] = { item: item, quantity: 0 })
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
		this.sale.items.forEach((item: Item) => this.cart[item.id] = { item: item, quantity: 0 });
	}

	buy() {
		// Create order ??
		let order: Order = this.jsonApiService.createRecord(Order, {
			'sale': this.sale,
			'owner': this.me,
		});
		order.save().subscribe(order => this.order = order);

		// Add orderlines
		// Filter ? Add ? Remove ? Update at 0 ? on API ???
		let orderlines: OrderLine[] = [];
		for (let i in this.cart) {
			if (this.cart[i].quantity > 0) {
				let orderline = this.jsonApiService.createRecord(OrderLine, {
					order: this.order,
					item: this.cart[i].item,
					quantity: this.cart[i].quantity,
				});
				orderline.save().subscribe(o => console.log(o));
				orderlines.push(orderline);
			}
		}
		

	}
}
