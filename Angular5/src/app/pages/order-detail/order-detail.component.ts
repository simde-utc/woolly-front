import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, finalize } from 'rxjs/operators';

import { JsonApiService } from '../../models/json-api.service';
import { AuthService } from '../../models/auth.service';
import { PaymentService } from '../../models/payment.service';

import { Sale, Item, Order, OrderLine, Field, OrderLineItem } from '../../models/sale';
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
		const id = this.route.snapshot.params.id;
		this.paymentService.checkOrder(id).subscribe(
			resp => console.log(resp),
			err => console.warn(err),
			() => this.getOrder(id).subscribe(
				(order: Order) => {
					this.order = order
					console.log(order)
				},
				err => this.router.navigate['/ventes'],
				() => this.loading = false
			)
		);
	}

	private getOrder(id: string) {
		// 'orderlines.item.itemfields', 'orderlines.item.itemfields.field',
		let includes = ['sale', 'orderlines', 'orderlines.item', 
				'orderlines.orderlineitems', 'orderlines.orderlineitems.orderlinefields']
		return this.jsonApiService.findRecord(Order, id, { include: includes.join(',') });
	}

	private hasEditableField(orderlineitem: OrderLineItem) : boolean {
		orderlineitem.orderlinefields.forEach(olfield => {
			if (olfield.editable)
				return true;
		});
		return false;
	}

	private modifyOrderLineFields(orderlineitem: OrderLineItem) {

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
