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
			(order: Order) => this.order = order,
			err => this.router.navigate['/ventes'],
			() => this.loading = false
		);
	}

	private hasNoEditableField(order: Order): boolean {
		order.orderlines.forEach((orderline: OrderLine) => {
			orderline.item.itemfields.forEach((itemfield: ItemField) => {
				if (itemfield.editable)
					return false;
			});
		});
		return true;
	}

	private modifyOrderLineFields(order: Order) {
		this.loading = true;
		let orderlineList: Observable<OrderLineField>[] = [];
		this.jsonApiService.findRecord(Order, order.id, {include: 'orderlines'}).subscribe(
			(orderstore: Order) => {
				orderstore.orderlines.forEach((orderline: OrderLine) => {
					orderline.orderlineitems.forEach((orderlineitem: OrderLineItem) => {
						orderlineitem.orderlinefields.forEach((orderlinefield: OrderLineField) => {
							if (orderlinefield.editable)
								orderlineList.push(orderlinefield.save());
						});
					});
				});
			});
		forkJoin(orderlineList).subscribe(
			(orderlinefields: OrderLineField[]) => console.log(orderlinefields),
			err => console.warn(err),
			() => this.loading = false
		);
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
