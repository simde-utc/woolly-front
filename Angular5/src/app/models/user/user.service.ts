import { Injectable } from '@angular/core';
import { Service, ISchema } from 'ngx-jsonapi';
import { UserType, User } from './user';

import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtTokenGetter } from '../auth.service';

@Injectable()
export class UserService extends Service<User> {
	public resource = User;
	public type = 'users';
	public schema: ISchema = {
		relationships: {
			usertype: {
				hasMany: false
			}
		}
	};
	public user_id: number = null;

	constructor(private jwtHelper: JwtHelperService) {
		super()
		let token = jwtTokenGetter();
		if (token) {
			let claims = this.jwtHelper.decodeToken(token)
			this.user_id = claims.data.user_id
		}
	}

}


@Injectable()
export class UserTypeService extends Service<UserType> {
	public resource = UserType;
	public type = 'usertypes';
	public schema: ISchema = { };

}
