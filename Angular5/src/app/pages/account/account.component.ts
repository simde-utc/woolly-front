import { Component } from '@angular/core';
import { JsonApiQueryData } from 'angular2-jsonapi';
import { JsonApiService } from '../../models/json-api.service';
import { AuthService } from '../../models/auth.service';
import { User } from '../../models/user';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html'
})
export class AccountComponent {
	me: User;
	loading: boolean = false;

	constructor(
		private authService: AuthService,
		private jsonApiService: JsonApiService
	) {
		this.authService.getUserId().subscribe(id => {
			this.jsonApiService.findRecord(User, String(id), { include: 'usertype,orders' }).subscribe(
				(user: User) => this.me = user,
				err => console.warn(err),
				() => this.loading = false
			)
		})
	}

}
