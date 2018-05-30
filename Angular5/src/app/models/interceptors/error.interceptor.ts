import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
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
			(err: any) => {
				if (err instanceof HttpErrorResponse) {
					switch(err.status) {
						case 302:	// Found
							break;
						case 400:	// BadRequest
							let errors = "";
							err.error.errors.forEach(e => errors += " - " + e.detail + "<br>")
							this.toastr.error(errors, "Mauvaise requête", { enableHtml: true });
							break;
						case 422:
							Object.keys(err.error.errors).map((key, i) => {
								err.error.errors[key].forEach(e => {
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
							this.toastr.error(err.error.errors[0].detail, "Impossible de trouver la ressource demandée");
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