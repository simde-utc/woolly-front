import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

// Components
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { AboutComponent } from './about/about.component';
import { SalesComponent } from './sales/sales.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

// Routes
const routes: Routes = [{
	path: '',
	component: PagesComponent,
	children: [
		// Main pages
		{ path: '', 			component: HomeComponent },
		{ path: 'about', 		component: AboutComponent },
		
		// Public sales
		{ path: 'ventes', 		component: SalesComponent },
		{ path: 'ventes/:id', 	component: SaleDetailComponent },
		{ path: 'paiement/:id', component: SaleDetailComponent },

		// Account
		{ path: 'mon_compte', 	component: AccountComponent },
		{ path: 'login', 		component: LoginComponent },
		{ path: 'logout', 		component: LogoutComponent },

		// Administration
		{ path: 'admin', 					component: HomeComponent },
		{ path: 'admin/ventes', 			component: HomeComponent },
		{ path: 'admin/ventes/nouvelle', 	component: HomeComponent },
		{ path: 'admin/ventes/:id', 		component: HomeComponent },
	]
}];

@NgModule({
	declarations: [
		PagesComponent,
		HomeComponent,
		AccountComponent,
		AboutComponent,
		SalesComponent,
		SaleDetailComponent,
		LoginComponent,
		LogoutComponent,
	],
	imports: [
		CommonModule,
		NgbModule,
		MDBBootstrapModule,
		RouterModule.forChild(routes),
	],
	bootstrap: [ PagesComponent ]
})
export class PagesModule { }
