import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

export function jwtTokenGetter() {
	return localStorage.getItem('jwt_token');
}


@Injectable()
export class AuthService {
	token: string = null;
	refresher: number;
	// isLogged : Boolean Subject for components to know log status
	private isLoggedSource = new BehaviorSubject<boolean>(false);
	isLogged$ = this.isLoggedSource.asObservable();

	constructor(
		private http: HttpClient,
		private jwtHelper: JwtHelperService
	) {
		let currentToken = jwtTokenGetter();
		if (currentToken) {
			this.token = currentToken;
			this.isLogged(true).subscribe();
			// this.startInterval();
		}
		this.changeLogStatus();
	}

	/*
	|--------------------------------------------------------------------------
	|	Fonctions atomiques
	|--------------------------------------------------------------------------
	| changeLogStatus
	| isLogged
	| refresh ?
	*/

	/**
	 * Change l'état de connection à partir du token stocké
	 */
	changeLogStatus() : void {
		this.isLoggedSource.next(Boolean(this.token));
	}

	/**
	 * Vérifie si l'utilisateur est connecté en local et/ou sur l'API
	 */
	isLogged(callAPI: boolean = false) : Observable<boolean> {
		this.token = jwtTokenGetter();
		// Appel à l'API si besoin
		if (Boolean(this.token) && callAPI) {
			return this.http.get<boolean>(environment.apiUrl + '/auth/validate').pipe(
				map((res: any) => {
					let isValid = Boolean(res.valid)
					// JWT non valide => suppression
					if (!isValid) {
						this.token = null;
						localStorage.removeItem('jwt_token')
					}
					return isValid
				}),
				finalize(() => this.changeLogStatus())
			)
		} else {
			let isValid = Boolean(this.token)
			this.changeLogStatus()
			return of(isValid);
		}
	}

	/**
	 * Rafraichit le JWT
	 * TODO + Timer
	 */
	refresh() : Observable<boolean> {
		return this.http.get<boolean>(environment.apiUrl + '/auth/refresh').pipe(
			// tap(res => console.log(res)),
			map(res => true),	// TODO
			finalize(() => this.changeLogStatus())		// Change le status
		)
	}

	getUserId() : Observable<number> {
		if (!Boolean(this.token))
			return of(null);
		let claims = this.jwtHelper.decodeToken(this.token)
		return of(claims.data.user_id);
	}
	/**
	 * Start & Clear Refresher interval
	 */
	private startInterval(TTL: number, offset: number = 5000) : void {
		this.refresher = window.setInterval(() => this.refresh(), TTL - offset);
	}
	private clearInterval() : void {
		window.clearInterval(this.refresher);
	}

	/*
	|--------------------------------------------------------------------------
	|	Fonctions principales
	|--------------------------------------------------------------------------
	*/

	getLoginUrl() : string {
		return environment.apiUrl + '/auth/login' + '?redirect=' + environment.frontUrl + 'login'
	}

	/**
	 * Se connecte à l'API et stocke le token après callback avec code
	 */
	login(code: string) : Observable<boolean> {
		return this.http.get<boolean>(environment.apiUrl + '/auth/jwt?code=' + code).pipe(
			map((jwt: any) => {
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
			}),
			finalize(() => this.changeLogStatus())
		);
	}

	/**
	 * Se déconnecte de l'API et efface le token
	 */
	logout() : Observable<boolean> {
		// Déconnexion du serveur
		// TODO Background task
		return this.http.post<boolean>(environment.apiUrl + '/auth/logout', {}).pipe(
			map((res:any) => {
				// Redirect et logout
				// TODO ajax ?
				// if (res.logout_url && res.logout_url != '')
					// window.location.href = res.logout_url
				return true
			}),
			catchError(err => {
				console.warn("Cannot logout from server : ", err);		// TODO
				return of(false);
			}),
			finalize(() => {
				// Suppression des tokens locaux
				this.token = null;
				localStorage.removeItem('jwt_token');				
				this.changeLogStatus()
			})
		);
	}


}
