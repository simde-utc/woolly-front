export class UserType {
	id: number;
	name: string;
}

export class User {
	id: number;
	email: string;
	firstname?: string;
	lastname?: string;
	login?: string;
	type: UserType;
}
