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
		// login?: string;
		// type: UserType;
	};

    // public type() : UserType {
        // return <UserType>this.relationships.usertype.data;
    // }

    // public photos(): ICollection<Photo> {
        // return <ICollection<Photo>>this.relationships.photos.data;
    // }
}
