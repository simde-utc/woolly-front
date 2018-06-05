// Main modules
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';

// Json API Module & Service
import { JsonApiModule } from 'angular2-jsonapi';
import { JsonApiService } from './models/json-api.service';
import { PaymentService } from './models/payment.service';
import { environment } from '../environments/environment';

// JWT Interceptor
import { AuthService, jwtTokenGetter } from './models/auth.service';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpInterceptorProviders } from './models/interceptors/';

// UI
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ToastrModule } from 'ngx-toastr';

// Layout + AppComponent
import { AppComponent } from './app.component';

// Locales
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');

// Routes
const routes: Routes = [
	// { path: 'login', 	component: LoginComponent },
	// { path: 'logout', 	component: LogoutComponent },
	// { path: 'admin', 	loadChildren: 'app/admin/admin.module#AdminModule', canActivate: [AuthGuard] },
	{ path: '', 		loadChildren: 'app/pages/pages.module#PagesModule'},
	// { path: '**', 		redirectTo: '' }
];


@NgModule({
	declarations: [		// Components
		AppComponent,
	],
	imports: [			// Modules
		FormsModule,
		BrowserModule,
		HttpClientModule,
		HttpClientXsrfModule.withOptions({
			cookieName: 'csrftoken ',
			headerName: 'HTTP_X_CSRFTOKEN',
		}),
		JwtModule.forRoot({
			config: {
				tokenGetter: jwtTokenGetter,
				whitelistedDomains: [ environment.apiDomain ],
				// blacklistedRoutes: [ environment.apiUrl + '/auth/' ],
			}
		}),
		JsonApiModule,
		RouterModule.forRoot(routes),
		BrowserAnimationsModule,
		MDBBootstrapModule.forRoot(),
		ToastrModule.forRoot({
			timeOut: 3000,
			progressBar: true
		}),
	],
	exports: [
		MDBBootstrapModule
	],
	providers: [		// Services
		{ provide: LOCALE_ID, useValue: 'fr' },
		JsonApiService,
		AuthService,
		PaymentService,
		HttpInterceptorProviders,
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
