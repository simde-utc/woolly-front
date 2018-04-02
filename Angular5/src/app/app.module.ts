// Main modules
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

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

@NgModule({
	declarations: [		// Components
		AppComponent
	],
	imports: [			// Modules
		BrowserModule,
		MDBBootstrapModule.forRoot(),
		RouterModule.forRoot(routes)
	],
	providers: [		// Services
		UserService,
		SaleService
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
