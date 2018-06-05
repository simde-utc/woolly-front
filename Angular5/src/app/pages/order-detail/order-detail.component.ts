import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, finalize } from 'rxjs/operators';

import { JsonApiService } from '../../models/json-api.service';
import { AuthService } from '../../models/auth.service';
import { PaymentService } from '../../models/payment.service';

import { Sale, Item, Order, OrderLine, Field } from '../../models/sale';
import { User } from '../../models/user';

import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-order-detail',
	templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent {
	order: Order;
	loading: boolean = true;

	constructor(
		private jsonApiService: JsonApiService,
		private authService: AuthService,
		private paymentService: PaymentService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.getOrder(this.route.snapshot.params.id).subscribe(
			(order: Order) => {
				this.order = order
				console.log(order)
			},
			err => this.router.navigate['/ventes'],
			() => this.loading = false
		);
	}

	private getOrder(id: string) {
		// 'orderlines.item.itemfields', 'orderlines.item.itemfields.field',
		let includes = ['sale', 'orderlines', 'orderlines.item', 
				'orderlines.orderlineitems', 'orderlines.orderlineitems.orderlinefields']
		return this.jsonApiService.findRecord(Order, id, { include: includes.join(',') });
	}

	private mapFieldType(type: string) {
		switch (type) {
			case 'int':
			case 'integer':
				return 'number';
			case 'string':
			default:
				return 'text';
		}
	}

}
