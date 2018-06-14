import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from "angular2-jsonapi";
import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

	constructor (private router: Router, private toastr: ToastrService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		return next.handle(req).do(
			(event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
					// do stuff with response if you want
				}
			},
			(errorResp: any) => {
				// JSON Api Errors: Useless
				if (errorResp instanceof ErrorResponse) {
					console.log("*****************************")
					console.log(errorResp.errors);
				} else if (errorResp instanceof HttpErrorResponse) {
					switch(errorResp.status) {
						case 302:	// Found
							break;
						case 400:	// BadRequest
							let errorMessage = "";
							errorResp.error.errors.forEach(e => {
								errorMessage += ' - ' + e.detail;
								if (e.source) errorMessage += ' (' + e.source.pointer + ')';
								errorMessage += '<br>';
							});
							this.toastr.error(errorMessage, "Mauvaise requête", { enableHtml: true, timeOut: 10000 });
							break;
						case 422:
							Object.keys(errorResp.error.errors).map((key, i) => {
								errorResp.error.errors[key].forEach(e => {
									this.toastr.error(e)
								});
							});
							break;
						case 401:	// Unauthorized
							// TODO
							// localStorage.removeItem('TOKEN');
							this.toastr.error("Vous devez être connecté pour effectuer cette action");
							// this.toastr.error("Votre session a expirée", "Veuillez vous reconnecter");
							this.router.navigate(['/login']);
							break;
						case 403:	// Forbidden
							// TODO
							this.toastr.error("Vous n'avez pas les droits nécessaires pour effectuer cette action");
							this.router.navigate(['/login']);
							break;
						case 404:	// NotFound
							this.toastr.error(errorResp.error.errors[0].detail, "Impossible de trouver la ressource demandée");
							this.router.navigate(['/ventes']);
							break;
						case 500:	// InternalServerError
							this.toastr.error("Erreur serveur", "Veuillez contactez l'administrateur");
							break;
						case 503:	// ServiceUnavailable
							this.toastr.error("Serveur indisponible", "Veuillez contactez l'administrateur");
							break;
						default:
							this.toastr.error("Erreur inconnue");					
					}
				} else {
					// this.logger.consoleLog('error', err, "ErrorInterceptor not HttpErrorResponse");
					this.toastr.error("Erreur inconnue", "Veuillez contactez l'administrateur");					
				}
			}
		);

	}
}