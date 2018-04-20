import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item, Sale } from '../../models/sale/sale';
import { SaleService } from '../../models/sale/sale.service';

@Component({
	selector: 'app-sale-detail',
	templateUrl: './sale-detail.component.html'
})
export class SaleDetailComponent implements OnInit {
	sale: Sale;

	constructor(
		private saleService: SaleService,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.route.params.subscribe(({ id }) => {
			this.saleService.get(id).subscribe(
				sale => this.sale = sale,
				error => console.error('Could not load author.')
			);
		});
	}
}
