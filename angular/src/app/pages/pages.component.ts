import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../models/auth.service';

@Component({
	selector: 'app-pages',
	templateUrl: './pages.component.html'
})
export class PagesComponent implements OnDestroy {
	isLogged: boolean = false;
	loginUrl: string = '';
	isLoggedSub: Subscription;

	constructor(private authService: AuthService) {
		this.loginUrl = this.authService.getLoginUrl();
		this.isLoggedSub = this.authService.isLogged$.subscribe(logged => this.isLogged = logged);
	}

	ngOnDestroy() {
		// Prevent memory leak
		this.isLoggedSub.unsubscribe();
	}

}
