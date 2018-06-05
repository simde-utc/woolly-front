import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { User, UserType } from './user';


@JsonApiModelConfig({ type: 'associations' })
export class Association extends JsonApiModel {
	@Attribute() login: string;
	@Attribute() name: string;
}


@JsonApiModelConfig({ type: 'itemgroups' })
export class ItemGroup extends JsonApiModel {
	@Attribute() name: string;
	@HasMany() items: Item[];
}


@JsonApiModelConfig({ type: 'sales' })
export class Sale extends JsonApiModel {
	@Attribute() name: string;
	@Attribute() description: string;
	@Attribute() created_at: Date;
	@Attribute() begin_at: Date;
	@Attribute() end_at: Date;
	@Attribute() max_payment_date: Date;
	@Attribute() max_item_quantity: string;

	@HasMany() items: Item[];
	@BelongsTo() association: Association;
}


@JsonApiModelConfig({ type: 'items' })
export class Item extends JsonApiModel {
	@Attribute() name: string;
	@Attribute() description: string;
	@Attribute() quantity: number;
	@Attribute() price: number;
	@Attribute() max_per_user: number;
	// @Attribute() remaining_quantity: number;

	@BelongsTo() sale: Sale;
	@BelongsTo() group: ItemGroup;
	@BelongsTo() usertype: UserType;
}


@JsonApiModelConfig({ type: 'orders' })
export class Order extends JsonApiModel {
	@Attribute() created_at: Date;
	@Attribute() updated_at: Date;
	@Attribute() status: number;
	@Attribute() tra_id: number;

	@BelongsTo() owner: User;
	@BelongsTo() sale: Sale;
	@HasMany() orderlines: OrderLine[];
}

@JsonApiModelConfig({ type: 'orderlines' })
export class OrderLine extends JsonApiModel {
	@Attribute() quantity: number;

	@BelongsTo() item: Item;
	@BelongsTo() order: Order;
}
/*
@JsonApiModelConfig({ type: 'paymentmethods' })
export class PaymentMethod extends JsonApiModel {
	id: number;
	name: string;
	url: string;
	// userType: UserType;
}
*/
