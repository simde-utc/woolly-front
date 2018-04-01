// Main modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Services


// Layout + AppComponent
import { AppComponent } from './app.component';

// Routes
const routes: Routes = [	
	// { path: 'login', 	component: LoginComponent },
	// { path: 'logout', 	component: LogoutComponent },
	// { path: 'admin', 	loadChildren: 'app/admin/admin.module#AdminModule', canActivate: [AuthGuard] },
	// { path: '', 		loadChildren: 'app/pages/pages.module#PagesModule'},
	// { path: '**', 		redirectTo: 'page-inconnue' }
];

@NgModule({
	declarations: [		// Components
		AppComponent
	],
	imports: [			// Modules
		BrowserModule,
		NgbModule.forRoot(),
		RouterModule.forRoot(routes)
	],
	providers: [		// Services
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
