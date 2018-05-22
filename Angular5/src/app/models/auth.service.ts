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

	/*
	|--------------------------------------------------------------------------
	|	Fonctions atomiques
	|--------------------------------------------------------------------------
	| isLogged
	| fetchJwt
	| refresh ?
	*/


	/**
	 * Vérifie si l'utilisateur est connecté en local et/ou sur l'API
	 */
	isLogged(callAPI: boolean = false) : Observable<boolean> {
		this.token = jwtTokenGetter();
		if (Boolean(this.token) && callAPI) {
			// TODO Appel API
			// return this.http.get<boolean>(environment.apiUrl + 'auth/isLogged');
			return of(Boolean(this.token))
		}
		return of(Boolean(this.token));
	}

	// /**
	//  * Get the JWT from the API
	//  */
	// fetchJwt(code: string) : Observable<boolean> {
	// 	// TODO POST + CSRF
	// }

	/*
	|--------------------------------------------------------------------------
	|	Fonctions principales
	|--------------------------------------------------------------------------
	*/

	getLoginUrl() : string {
		return environment.apiUrl + 'auth/login' + '?redirect=' + environment.frontUrl + 'login'
	}

	/**
	 * Se connecte à l'API et stocke le token après callback avec code
	 */
	login(code: string) : Observable<boolean> {
		return this.http.get<boolean>(environment.apiUrl + 'auth/jwt?code=' + code).pipe(
			map((jwt: any) => {
				console.log('token', jwt)
				if (jwt && jwt.token) {
					this.token = jwt.token;
					localStorage.setItem('jwt_token', this.token);
					// this.startInterval();
					return true;
				}
				return false;
			}),
			catchError(err => {
				console.warn(err)
				return of(false);
			})
		);
	}

	/**
	 * Se déconnecte de l'API et efface le token
	 */
	logout() : Observable<boolean> {
		// Suppression des tokens locaux
		this.token = null;
		localStorage.removeItem('jwt_token');				

		// Déconnexion du serveur
		// TODO Background task
		return this.http.post<boolean>(environment.apiUrl + 'auth/logout', {}).pipe(
			map(res => true),
			catchError(err => {
				console.warn("Cannot logout from server : ", err);		// TODO
				return of(false);
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
