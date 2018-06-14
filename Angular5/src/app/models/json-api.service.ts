import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonApiDatastoreConfig, JsonApiDatastore, DatastoreConfig } from 'angular2-jsonapi';
import { environment } from '../../environments/environment';

// Models
import { User, UserType } from './user';
import { Sale, Item, ItemGroup, Association, OrderLine, Order, Field, ItemField, OrderLineItem, OrderLineField } from './sale';


const config: DatastoreConfig = {
	baseUrl: environment.apiUrl,
	models: {
		// User & UserType
		users: User,
		usertypes: UserType,

		// Sale & Association
		associations: Association,
		sales: Sale,

		// Order & OrderLine
		orders: Order,
		orderlines: OrderLine,

		// Item & ItemGroup
		items: Item,
		itemgroups: ItemGroup,

		// Field & ItemField
		fields: Field,
		itemfields: ItemField,

		// OrderLineItem & OrderLineField
		orderlineitems: OrderLineItem,
		orderlinefields: OrderLineField,
	}
};

@Injectable()
@JsonApiDatastoreConfig(config)
export class JsonApiService extends JsonApiDatastore {

	constructor(http: HttpClient) {
		super(http);
	}

}
