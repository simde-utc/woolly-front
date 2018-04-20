import { Component, OnInit } from '@angular/core';
import { UserService } from '../models/user/user.service';
@Component({
	selector: 'app-pages',
	templateUrl: './pages.component.html'
})
export class PagesComponent implements OnInit {
	isConnected: boolean = false;

	constructor(private userService: UserService) { }

	ngOnInit() {
		// this.isConnected = this.userService.isConnected();
		// TODO : not working
	}

}
