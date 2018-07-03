import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../models/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html'
})
export class LoginComponent {
	loginUrl: string = '';
	loading: boolean = false;

	constructor(
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.loginUrl = this.authService.getLoginUrl();
		this.route.queryParams.subscribe(params => {
			let code = params['code']
			if (code && code != '') {
				this.loading = true;		// Show spinner
				// Get JWT
				this.authService.login(code).subscribe(
					logged => {
						if (logged)		// Redirect once logged in
							this.router.navigate(['']);
						else {
							// TODO Show error
							this.loading = false
							// Erase ?code=...
						}
					},
					err => console.log('ERR 2', err)	// TODO
				);
			}
		})
		this.authService.isLogged().subscribe(logged => {
			if (logged)
				this.router.navigate(['']);
		})
	}

}
