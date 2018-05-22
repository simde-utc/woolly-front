import { Resource, ICollection } from 'ngx-jsonapi';
import { UserType } from '../user/user';

export class Association {
	login: string;
	name: string;
}
export class ItemSpecification extends Resource {
	public attributes: {
	}
}

export class Item extends Resource {
	public attributes: {
		name: string;
		description: string;
		remaining_quantity: number;
		initial_quantity: number;
		sale_id: number;
		// price: number;
		// userType: UserType;
	}
}

export class ItemGroup {
	id: number;
	name: string;
	items: Item[];
}

export class Sale extends Resource {
	public attributes: {
		name: string;
		description: string;
		creation_date: Date;
		begin_date: Date;
		end_date: Date;
		max_payment_date: string;
		max_item_quantity: 4000;
		association: string;
	}

    public items(): ICollection<Item> {
        return <ICollection<Item>>this.relationships.items.data;
    }

	// itemGroups: ItemGroup[];
	
	// max_payment ?
	// background?: string;
}

export class PaymentMethod {
	id: number;
	name: string;
	url: string;
	// userType: UserType;
}