import { Component } from '@angular/core';
import { AuthService } from '../../models/auth.service';
import { User } from '../../models/user';
import { Order } from '../../models/sale';
import {PaymentService} from '../../models/payment.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html'
})
export class AccountComponent {
	me: User;
	orders: Order[] = [];
	loading: boolean = false;

	constructor(private authService: AuthService, private paymentService: PaymentService) {
		const includes = 'usertype,orders,orders.sale,orders.orderlines,orders.orderlines.item';
		this.authService.getUser({ include: includes }).subscribe(
			(user: User) => {
				this.me = user
				this.orders = user.orders.filter((order: Order) => order.orderlines && order.orderlines.length > 0)
			},
			err => console.warn(err),
			() => this.loading = false
		);
	}
	generatePDF(order: Order) {
		this.paymentService.getPDF(order.id).subscribe(url => console.log(url));
	}
}
