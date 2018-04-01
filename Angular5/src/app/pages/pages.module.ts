import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
	path: '',
	component: PagesComponent,
	children: [
		{ path: '', component: HomeComponent },
	]
}];

@NgModule({
	declarations: [
		PagesComponent,
		HomeComponent,
	],
	imports: [
		CommonModule,
		NgbModule,
		RouterModule.forChild(routes),
	],
	bootstrap: [ PagesComponent ]
})
export class PagesModule { }
