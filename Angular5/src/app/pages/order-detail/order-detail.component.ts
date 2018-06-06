import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, finalize } from 'rxjs/operators';

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
		this.paymentService.checkOrder(id).subscribe(
			// resp => console.log(resp),
			// err => console.warn(err),
			() => this.getOrder(id).subscribe(
				(order: Order) => {
					this.order = order;
					// console.log(order);
				},
				err => this.router.navigate['/ventes'],
				() => this.loading = false
			)
		);
	}

	private getOrder(id: string) {
		// 'orderlines.item.itemfields', 'orderlines.item.itemfields.field',
		let includes = ['sale', 'orderlines', 'orderlines.item', 'orderlines.orderlineitems', 'orderlines.orderlineitems.orderlinefields',
			'orderlines.item.itemfields', 'orderlines.orderlineitems.orderlinefields.field']
		return this.jsonApiService.findRecord(Order, id, { include: includes.join(',') });
	}

	private hasEditableField(order: Order): boolean {
		let res = true;
		order.orderlines.forEach(orderline => {
			orderline.item.itemfields.forEach(field => {
				if (field.editable)
					res = false;
			});
		});
		return res;
	}

	private modifyOrderLineFields(order: Order) {
		let order_save = order;
		if (this.editmode) {
			// console.log(orderlineitem.orderline.id);
			this.jsonApiService.findRecord(Order, order.id, {include: 'orderlines'}).subscribe(
				(orderstore: Order) => {
					orderstore.orderlines.forEach(orderline => {
						for (let i = 0; i < orderline.orderlineitems.length; i++) {
							for (let j = 0; j < orderline.orderlineitems[i].orderlinefields.length; j++) {
								orderline.orderlineitems[i].orderlinefields[j].save().subscribe();
							}
						}
					});
				},
				err => console.error('Erreur lors de la modification des champs')
			);
			this.editmode = false;
			// this.getOrder(this.route.snapshot.params.id).subscribe();
			this.order = order_save;
		} else {
			this.editmode = true;
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

	private isEditableField(i: ItemField[], idF: number, idIt: number): boolean {
		let res: boolean = false;
		i.forEach(f => {
			if (f.field.id === idF.toString() && f.item.id === idIt.toString())
				res = f.editable && this.editmode;
		});
		return !res;
	}
}
