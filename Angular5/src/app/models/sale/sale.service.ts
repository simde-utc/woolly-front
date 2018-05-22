import { Injectable } from '@angular/core';
import { Service, ISchema } from 'ngx-jsonapi';

import { Item, Sale } from './sale';

@Injectable()
export class SaleService extends Service<Sale> {
	public resource = Sale;
	public type = 'sales';
	public schema: ISchema = {
		relationships: {
			woollyusertypes: {
				hasMany: true
			},
		}
	};
}
