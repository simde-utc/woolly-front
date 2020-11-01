import React from 'react'
import { useStoreAPIData } from '../../redux/hooks';

import { Container, Grid } from '@material-ui/core';
import SaleCard, { SaleCardSkeleton } from '../../components/sales/SaleCard';


export default function Sales(props) {
	const sales = useStoreAPIData('sales', { queryParams: { include: 'association', order_by: '-begin_at' }});

	return (
		<Container>
			<h1>Liste des ventes</h1>

			<Grid container spacing={2}>
				{sales ? (
					Object.values(sales).map(sale => <SaleCard key={sale.id} sale={sale} />)
				) : (
					[...Array(3).keys()].map(index => <SaleCardSkeleton key={index} />)
				)}
			</Grid>
		</Container>
	);
}
