import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../models/auth.service';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html'
})
export class LogoutComponent {
	constructor(
		private authService: AuthService,
		private router: Router
	) {
		this.authService.logout().subscribe(loggedOut => {
			if (!loggedOut)
				console.log("Erreur de déconnexion");		// TODO
			this.router.navigate(['']);
		});		
	}
}
