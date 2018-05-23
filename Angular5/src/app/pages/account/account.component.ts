import { Component } from '@angular/core';
import { ICollection } from 'ngx-jsonapi';
import { UserService } from '../../models/user/user.service';
import { User } from '../../models/user/user';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html'
})
export class AccountComponent {
	me: User;

	constructor(private userService: UserService) {
		let id = String(this.userService.user_id)
		// TODO id
		this.userService.get(id).subscribe(
			(user: User) => {
				console.log(user)
				this.me = user
			}
		)
	}

}
