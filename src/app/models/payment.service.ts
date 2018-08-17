import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, finalize } from 'rxjs/operators';

import { Router } from '@angular/router';
import { JsonApiService } from '../models/json-api.service';
import { User } from '../models/user';
import { jwtTokenGetter } from './auth.service';

const jsonApiOptions = {
	headers: new HttpHeaders({
		'Accept':  'application/vnd.api+json, application/json'
	})
};
const pdfOptions = {
	headers: new HttpHeaders({
		'Accept': 'application/pdf'
	}),
	responseType: 'blob'
}


@Injectable()
export class PaymentService {

	constructor(
		private http: HttpClient,
		private router: Router
	) { }

	payOrder(id: string): Observable<any> {
		const base_url = window.location.href.replace(this.router.url, '')
		const url = environment.apiUrl + '/orders/' + id + '/pay?return_url=' + base_url + '/commandes/' + id
		return this.http.get<any>(url, jsonApiOptions);
	}
	checkOrder(id: string): Observable<any> {
		return this.http.get<any>(environment.apiUrl + '/orders/' + id + '/pay_callback', jsonApiOptions);
	}

	// cancelOrder(id: string) {
	//
	// }

	// getTicket() { }

	getPDF(id: string): string {
		return environment.apiUrl + '/orders/' + id + '/pdf?code=' + jwtTokenGetter();
		// return this.http.get<any>(environment.apiUrl + '/orders/' + id + '/pdf', pdfOptions);
	}
}
