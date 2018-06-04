import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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
	tra_url: string = null;

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

	getSale(id) {
		this.jsonApiService.findRecord(Sale, id, { include: 'items' }).subscribe(
			(sale: Sale) => {
				this.sale = sale;
				this.initCart();
			},
			err => {
				console.log('*******************************'),
				this.router.navigate['/ventes'];
			},
			() => this.loading = false
		);
	}

	buy(): void {
		this.createOrder();
		console.log(this.cart)
	}

	/*
	|--------------------------------------------------------------------------
	|	Private Functions
	|--------------------------------------------------------------------------
	*/

	private initCart() : void {
		this.cart = {};
		this.sale.items.forEach((item: Item) => this.cart[item.id] = { item: item, quantity: 0 })
	}

	// Create order
	private createOrder(): void {
		let order: Order = this.jsonApiService.createRecord(Order, {
			'sale': this.sale,
			'owner': this.me,
		});
		order.save().subscribe(order => {
			this.order = order;
			this.addOrderlines();
		});
	}

	private addOrderlines() {
		// Add orderlines
		let orderlines: OrderLine[] = [];
		for (let i in this.cart) {
			let orderline = this.jsonApiService.createRecord(OrderLine, {
				order: this.order,
				item: this.cart[i].item,
				quantity: this.cart[i].quantity,
			});
			orderline.save().subscribe(o => console.log(o));
			orderlines.push(orderline);
		}
		this.pay()
	}

	private pay() {
		this.http.get<any>(environment.apiUrl+'/orders/'+this.order.id+'/pay?return_url='+environment.frontUrl).subscribe(
			resp => {
				console.log(resp)
				if (resp['error']) {
					let errorMessage = "";
					resp.errors.forEach(e => errorMessage += ' - ' + e + '<br>')
					this.toastr.error(errorMessage, "Erreur lors de la commande", { enableHtml: true, timeOut: 20000 });
				} else {
					this.tra_url = resp.url
				}
			},
		)
	}
}
