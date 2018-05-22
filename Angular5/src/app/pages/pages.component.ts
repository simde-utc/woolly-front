import { Component, OnInit } from '@angular/core';
import { AuthService } from '../models/auth.service';
@Component({
	selector: 'app-pages',
	templateUrl: './pages.component.html'
})
export class PagesComponent implements OnInit {
	isConnected: boolean = false;
	loginUrl: string = '';

	constructor(private authService: AuthService) { }

	ngOnInit() {
		// TODO fix changes
		this.authService.isLogged().subscribe(logged => this.isConnected);
		this.loginUrl = this.authService.getLoginUrl();
	}

}
