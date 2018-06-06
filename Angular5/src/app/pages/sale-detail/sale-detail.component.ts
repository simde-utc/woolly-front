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
import { PaymentService } from '../../models/payment.service';

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
	hasOngoingOrder: boolean = false;

	constructor(
		private jsonApiService: JsonApiService,
		private authService: AuthService,
		private paymentService: PaymentService,
		private route: ActivatedRoute,
		private router: Router,
		private http: HttpClient,
		private toastr: ToastrService
	) {
		this.getSale(this.route.snapshot.params.id).subscribe(
			(sale: Sale) => {
				this.sale = sale;
				this.initCart();
				this.authService.getUser('').subscribe((user: User) => {
					this.me = user
					if (user) {
						this.getOrder().subscribe((order: Order) => {
							this.order = order;
							console.log(order)
							if (order.status != 0)
								this.hasOngoingOrder = true;
						});
					}
				});
			},
			err => this.router.navigate['/ventes'],
			() => this.loading = false
		);
	}

	getSale(id: string): Observable<Sale> {
		return this.jsonApiService.findRecord(Sale, id, { include: 'items' });
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
	| buy, getOrder, addOrderlines, payOrder
	*/

	buy(): void {
		if (this.isCartEmpty())
			return;
		this.addOrderlines().subscribe(
			(orderlines: OrderLine[]) => {
				this.payOrder();
			}
		);
	}

	private getOrder(): Observable<Order> {
		let order: Order = this.jsonApiService.createRecord(Order, {
			'sale': this.sale,
			'owner': this.me,
		});
		return order.save();
	}

	private addOrderlines(): Observable<OrderLine[]> {
		// Add orderline subscriptions to array
		let orderlines: Observable<OrderLine>[] = [];
		for (let id in this.cart) {
			if(this.cart[id].quantity > 0) {
				let orderline = this.jsonApiService.createRecord(OrderLine, {
					order: this.order,
					item: this.cart[id].item,
					quantity: this.cart[id].quantity,
				});
				orderlines.push(orderline.save());
			}
		}
		// ForkJoin subscription to get all orderlines once created
		return forkJoin(orderlines);
	}

	private payOrder(): void {
		this.paymentService.payOrder(this.order.id).subscribe(transaction => {
			console.log(transaction);
			if (transaction.url)
				window.location.href = transaction.url
		});
	}

	private cancelOrder(): void {
		
	}
}
