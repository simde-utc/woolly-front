import { UserType } from '../user/user';

export class Item {
	id: number;
	name: string;
	description: string;
	quantityLeft: number;
	price: number;
	userType: UserType;
}

export class Sale {
	id: number;
	name: string;
	description: string;
	creationDate: Date;
	beginDate: Date;
	endDate: Date;
	// max_payment ?
	// background?: string;
}
