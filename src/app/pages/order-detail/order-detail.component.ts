import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, finalize, delay } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { JsonApiService } from '../../models/json-api.service';
import { AuthService } from '../../models/auth.service';
import { PaymentService } from '../../models/payment.service';

import {Sale, Item, Order, OrderLine, Field, OrderLineItem, OrderLineField, ItemField} from '../../models/sale';
import { User } from '../../models/user';

import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-order-detail',
	templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent {
	order: Order;
	loading: boolean = true;
	editmode: boolean;
	pdfUrl: string;

	constructor(
		private jsonApiService: JsonApiService,
		private authService: AuthService,
		private paymentService: PaymentService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		const id = this.route.snapshot.params.id;
		// Appel callback
		this.paymentService.checkOrder(id).pipe(
			delay(250) // Evite la superposition de callback avec payutc
		).subscribe(
			// resp => console.log(resp),
			// err => console.warn(err),
			() => this.getOrder(id)
		);
	}

	private getOrder(id: string) {
		this.loading = true;
		let includes = ['sale', 'orderlines', 'orderlines.item', 'orderlines.orderlineitems', 
			'orderlines.orderlineitems.orderlinefields', 'orderlines.item.itemfields']
		return this.jsonApiService.findRecord(Order, id, { include: includes.join(',') }).subscribe(
			(order: Order) => {
				this.order = order;
				this.pdfUrl = this.paymentService.getPDF(this.order.id);
			},
			err => this.router.navigate(['/ventes']),
			() => this.loading = false
		);
	}

	private hasNoEditableField(order: Order): boolean {
		let resp: boolean = true;
		if (!order.orderlines) return false;
		order.orderlines.forEach((orderline: OrderLine) => {
			if (orderline.item && orderline.item.itemfields)
				orderline.item.itemfields.forEach((itemfield: ItemField) => {
					if (itemfield.editable)
						resp = false;
				});
			else
				resp = false;
		});
		return resp;
	}

	private modifyOrderLineFields(order: Order) {
		this.loading = true;
		let orderlineList: Observable<OrderLineField>[] = [];
		this.order.orderlines.forEach((orderline: OrderLine) => {
			orderline.orderlineitems.forEach((orderlineitem: OrderLineItem) => {
				if (orderlineitem.orderlinefields && orderlineitem.orderlinefields.length > 0)
					orderlineitem.orderlinefields.forEach((orderlinefield: OrderLineField) => {
						if (orderlinefield.editable)
							orderlineList.push(orderlinefield.save());
					});
			});
		});
		if (orderlineList.length > 0) {
			forkJoin(orderlineList).subscribe(
				// (orderlinefields: OrderLineField[]) => this.router.navigate(['mon_compte']),
				// err => console.warn(err),
				() => this.loading = false
			);
		} else {
			this.loading = false;
		}
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
