import { Component, OnInit } from '@angular/core';
import { ICollection } from 'ngx-jsonapi';
import { Item, Sale } from '../../models/sale/sale';
import { SaleService } from '../../models/sale/sale.service';

@Component({
	selector: 'app-sales',
	templateUrl: './sales.component.html'
})
export class SalesComponent implements OnInit {
	sales: ICollection<Sale>;

	constructor(private saleService: SaleService) { }

	ngOnInit() {
		this.saleService.all().subscribe(sales => this.sales = sales);
	}

}
