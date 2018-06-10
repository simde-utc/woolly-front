import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { JsonApiService } from '../models/json-api.service';
import { User } from '../models/user';

@Injectable()
export class PaymentService {

	constructor(
		private http: HttpClient
	) { }

	payOrder(id: string): Observable<any> {
		const url = environment.apiUrl + '/orders/' + id + '/pay?return_url='
					+ environment.frontUrl + 'commandes/' + id
		return this.http.get<any>(url);
	}
	checkOrder(id: string): Observable<any> {
		return this.http.get<any>(environment.apiUrl + '/orders/' + id + '/pay_callback');
	}

	// cancelOrder(id: string) {
	//
	// }

	// getTicket() { }

	getPDF(id: string): Observable<any> {
		return this.http.get<any>(environment.apiUrl + '/orders/' + id + '/pdf/');
	}
}
