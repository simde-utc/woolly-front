import { Injectable } from '@angular/core';
import { Service, ISchema } from 'ngx-jsonapi';

import { UserType, User } from './user';

@Injectable()
export class UserService extends Service<User> {
	public resource = User;
	public type = 'woollyusers';
	public schema: ISchema = {
		relationships: {
			woollyusertypes: {
				hasMany: true
			},
		}
	};
}


@Injectable()
export class UserTypeService extends Service<UserType> {
	public resource = User;
	public type = 'woollyusertypes';
	public schema: ISchema = { };

}
