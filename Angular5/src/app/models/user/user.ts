import { Resource } from 'ngx-jsonapi';

export class UserType extends Resource {
	public attributes: {
		name: string;
	}
}

export class User extends Resource {
	public attributes: {
		email: string;
		firstname?: string;
		lastname?: string;
		login?: string;
		type: UserType;
	};
}
