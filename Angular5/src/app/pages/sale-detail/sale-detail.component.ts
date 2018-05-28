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
	// sale: Sale;

	constructor(
		private jsonApiService: JsonApiService,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.route.params.subscribe(({ id }) => {
			// this.saleService.get(id).subscribe(
				// sale => this.sale = sale,
				// error => console.error('Could not load author.')
			// );
		});
	}
}
