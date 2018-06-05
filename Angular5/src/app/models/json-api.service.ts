import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonApiDatastoreConfig, JsonApiDatastore, DatastoreConfig } from 'angular2-jsonapi';
import { environment } from '../../environments/environment';

// Models
import { User, UserType } from './user';
import {Sale, Item, Association, OrderLine, Order, Field, OrderLineField, ItemField} from './sale';


const config: DatastoreConfig = {
	baseUrl: environment.apiUrl,
	models: {
		// Users & Association
		users: User,
		usertypes: UserType,
		associations: Association,

		// Sales
		sales: Sale,

		// Orders
		orders: Order,
		orderlines: OrderLine,

		// Items & Fields
		items: Item,
		fields: Field,
		ordelinefields: OrderLineField,
		itemfields: ItemField


	}
};

@Injectable()
@JsonApiDatastoreConfig(config)
export class JsonApiService extends JsonApiDatastore {

	constructor(http: HttpClient) {
		super(http);
	}

}
