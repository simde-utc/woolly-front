// Main modules
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Json API Module & Service
import { JsonApiModule } from 'angular2-jsonapi';
import { JsonApiService } from './models/json-api.service';
import { environment } from '../environments/environment';

// JWT Interceptor
import { AuthService, jwtTokenGetter } from './models/auth.service';
import { JwtModule } from '@auth0/angular-jwt';

// UI
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

// Layout + AppComponent
import { AppComponent } from './app.component';

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
		MDBBootstrapModule.forRoot(),
		BrowserAnimationsModule,
	],
	providers: [		// Services
		AuthService,
		JsonApiService,
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
