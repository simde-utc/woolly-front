// Main modules
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxJsonapiModule } from 'ngx-jsonapi';
import { environment } from '../environments/environment';

// UI
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


// Services
import { UserService } from './models/user/user.service';
import { SaleService } from './models/sale/sale.service';


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

// JSON API Resources
/*
// import { StoreModule } from '@ngrx/store';
// import { counterReducer } from './counter';
import { NgrxJsonApiModule, ResourceDefinition } from 'ngrx-json-api';
let resourceDefinitions: Array<ResourceDefinition> = [
	{ type: 'User', 	collectionPath: 'users' },
	{ type: 'Sale', 	collectionPath: 'sales' },
];
import { EffectsModule } from '@ngrx/effects';
*/



@NgModule({
	declarations: [		// Components
		AppComponent
	],
	imports: [			// Modules
		BrowserModule,
		HttpClientModule,
		MDBBootstrapModule.forRoot(),
		BrowserAnimationsModule,
		RouterModule.forRoot(routes),
		NgxJsonapiModule.forRoot({
			url: environment.apiURL
		})
	],
	providers: [		// Services
		UserService,
		SaleService
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
