import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { catchError, map, tap, finalize } from 'rxjs/operators';

import { JsonApiQueryData } from 'angular2-jsonapi';
import { JsonApiService } from '../../models/json-api.service';
import { AuthService } from '../../models/auth.service';

import { Sale, Item, Order, OrderLine } from '../../models/sale';
import { User } from '../../models/user';

import { environment } from '../../../environments/environment';

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
		private router: Router,
		private http: HttpClient,
		private toastr: ToastrService
	) {
		this.getSale(this.route.snapshot.params.id);
		this.authService.getUser('').subscribe((user: User) => this.me = user);
	}

	getSale(id): void {
		this.jsonApiService.findRecord(Sale, id, { include: 'items' }).subscribe(
			(sale: Sale) => {
				this.sale = sale;
				this.initCart();
			},
			err => this.router.navigate['/ventes'],
			() => this.loading = false
		);
	}

	private initCart() : void {
		this.cart = {};
		this.sale.items.forEach((item: Item) => this.cart[item.id] = { item: item, quantity: 0 })
	}

	isCartEmpty() : boolean {
		let sum = Object.values(this.cart).reduce((acc: number, item: any) => acc + item.quantity, 0);
		return sum <= 0;
	}

	/*
	|--------------------------------------------------------------------------
	|	Order Management Functions
	|--------------------------------------------------------------------------
	| buy, createOrder, createOrderlines, getTransaction
	*/

	buy(): void {
		if (this.isCartEmpty())
			return;
		this.createOrder().subscribe(
			(order: Order) => {
				this.order = order;
				this.createOrderlines().subscribe(
					(orderlines: OrderLine[]) => {
						this.getTransaction().subscribe(
							transaction => {
								console.log(transaction)
								// window.location.href = transaction.url
							}
						)
					}
				);
			}
		);
	}

	private createOrder(): Observable<Order> {
		let order: Order = this.jsonApiService.createRecord(Order, {
			'sale': this.sale,
			'owner': this.me,
		});
		return order.save();
	}

	private createOrderlines(): Observable<OrderLine[]> {
		// Add orderline subscriptions to array
		let orderlines: Observable<OrderLine>[] = [];
		for (let id in this.cart) {
			let orderline = this.jsonApiService.createRecord(OrderLine, {
				order: this.order,
				item: this.cart[id].item,
				quantity: this.cart[id].quantity,
			});
			orderlines.push(orderline.save());
		}
		// ForkJoin subscription to get all orderlines once created
		return forkJoin(orderlines);
	}

	private getTransaction() {
		return this.http.get<any>(
			environment.apiUrl+'/orders/'+this.order.id+'/pay?return_url='+environment.frontUrl
		);
	}
}
