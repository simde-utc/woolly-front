import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../models/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
	loginUrl: string = '';
	loading: boolean = false;

	constructor(
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		// here or constructor ?
		this.loginUrl = this.authService.getLoginUrl();
		this.route.queryParams.subscribe(params => {
			let code = params['code']
			if (code) {
				this.loading = true;		// Show spinner
				// Get JWT
				this.authService.getJwt(code).subscribe(logged => {
					if (logged) {
						console.log("Success ! Logged")
						// Redirect once logged in
						this.router.navigate(['']);
					} else {
						// Show error
						console.log("ERROR !!!! NOT LOGGED")
						// Erase ?code=...
					}
				});
			}
			console.log(code)
			// if (code)
		})
	}

	login() {
		// Redirect away from this.loginUrl	and show loader
		this.loading = true
	}

}
