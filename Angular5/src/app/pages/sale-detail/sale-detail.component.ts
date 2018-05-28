import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonApiQueryData } from 'angular2-jsonapi';
import { JsonApiService } from '../../models/json-api.service';
import { Sale, Item } from '../../models/sale';

@Component({
	selector: 'app-sale-detail',
	templateUrl: './sale-detail.component.html'
})
export class SaleDetailComponent implements OnInit {
	sale: Sale;
	loading = true;

	constructor(
		private jsonApiService: JsonApiService,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.getSale(this.route.snapshot.params.id);
	}

	getSale(id) {
		this.jsonApiService.findRecord(Sale, id).subscribe(
			(sale: Sale) => {
				this.sale = sale;
				this.loading = false;
				console.log(this.sale);
			}
		);
	}
}
