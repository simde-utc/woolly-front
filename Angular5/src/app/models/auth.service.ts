import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, finalize } from 'rxjs/operators';

export function jwtTokenGetter() {
	return localStorage.getItem('jwt_token');
}


@Injectable()
export class AuthService {
	token: string = '';
	refresher: number;

	constructor(private http: HttpClient) {
		let currentToken = jwtTokenGetter();
		if (currentToken) {
			this.token = currentToken;		// TODO : Get the current Token and store it Useful ??
			// this.startInterval();
		}
	}

	/**
	 * Vérifie si l'utilisateur est connecté
	 */
	isLogged() : boolean {
		this.token = jwtTokenGetter();
		return Boolean(this.token);
	}


	/**
	 * Return the login url
	 */
	getLoginUrl() : string {
		return environment.apiUrl + 'auth/login' + '?redirect=' + environment.frontUrl + 'login'
	}


	/**
	 * Get the JWT from the API
	 */
	getJwt(code: string) : Observable<boolean> {
		// TODO POST + CSRF
		return this.http.get<boolean>(environment.apiUrl + 'auth/jwt?code=' + code).pipe(
			map(jwt => {
				console.log('token', jwt)
				if (jwt && jwt.token) {
					this.token = jwt.token;
					localStorage.setItem('jwt_token', this.token);
					// this.startInterval();
					return true;
				}
				return false;
			})
		);
	}

	/*
	login() : Observable<boolean> {
		return this.http.get(apiUrl + 'auth/callback').pipe(
			map((res: any) => {
				let token = res.access_token;
				if (token) {
					this.token = token;
					localStorage.setItem('jwt_token', this.token);
					this.logger.toast('success', "Vous êtes connecté");
					this.startInterval();
					return true;
				}
				return false;
			})
		);
	}

	/**
	 * Se déconnecte de l'API et efface le token
	 */
	/*
	logout() : Observable<boolean> {
		this.token = null;
		if (!jwtTokenGetter())	// Déjà supprimé
			return of(true);

		return this.http.post<boolean>(apiUrl + 'logout', {}).pipe(
			map(res => {
				return true;
			}),
			finalize(() => {
				this.clearInterval();
				this.logger.toast('success', "Vous venez d'être déconnecté");
				localStorage.removeItem('TOKEN');				
			})
		);
	}


	/*
	private startInterval() {
		this.refresher = window.setInterval(() => this.refreshToken(), 3 * 60 * 1000);		// 3 min
	}
	private clearInterval() {
		window.clearInterval(this.refresher);
	}
	*/
}
