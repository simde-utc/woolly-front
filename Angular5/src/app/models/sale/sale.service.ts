import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
// import { catchError, map, tap } from 'rxjs/operators';
// import 'rxjs/add/operator/do';

import { environment } from '../../../environments/environment';
import { Item, Sale } from './sale';

// console.log(environment.apiURL);			// API URL

@Injectable()
export class SaleService {

	constructor(private http: HttpClient) { }

	getSales() : Observable<Sale[]>  {
		return of([]);
	}
}
