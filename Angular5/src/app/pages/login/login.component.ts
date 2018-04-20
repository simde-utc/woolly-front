import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../models/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
	loginUrl: string = '';

	constructor(private authService: AuthService) { }

	// TODO useless
	ngOnInit() {
		this.loginUrl = this.authService.getLoginUrl();
	}

}
