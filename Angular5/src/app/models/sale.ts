import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';
import { User, UserType } from './user';

// ===========================================
// 		Association & Sale
// ===========================================
@JsonApiModelConfig({ type: 'associations' })
export class Association extends JsonApiModel {
	@Attribute() login: string;
	@Attribute() name: string;
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

	@BelongsTo() association: Association;
}


// ===========================================
// 		Item & ItemGroup
// ===========================================
@JsonApiModelConfig({ type: 'items' })
export class Item extends JsonApiModel {
	@Attribute() name: string;
	@Attribute() description: string;
	// @Attribute() remaining_quantity: number;
	@Attribute() quantity: number;
	@Attribute() price: number 
	@Attribute() nemopay_id: number
	@Attribute() max_per_user: number

	@BelongsTo() usertype: UserType
	@BelongsTo() group: ItemGroup;
	@BelongsTo() sale: Sale;
}

@JsonApiModelConfig({ type: 'itemgroups' })
export class ItemGroup extends JsonApiModel {
	@Attribute() name: string;
	@HasMany() items: Item[];
}

// ===========================================
// 		Order & OrderLine
// ===========================================
@JsonApiModelConfig({ type: 'orders' })
export class Order extends JsonApiModel {
	@Attribute() created_at: Date;
	@Attribute() updated_at: Date;
	@Attribute() status: string;
	@Attribute() tra_id: number;

	@BelongsTo() owner: User;
	@BelongsTo() sale: Sale;
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
