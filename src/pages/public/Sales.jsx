import React from 'react'
import { useStoreAPIData } from '../../redux/hooks';

import { Container, Box } from '@material-ui/core';
import SaleCard, { SaleCardSkeleton } from '../../components/sales/SaleCard';


export default function Sales(props) {
	const sales = useStoreAPIData('sales', { queryParams: { include: 'association' }});

	return (
		<Container>
			<h1>Liste des ventes</h1>

			<Box display="flex" flexWrap="wrap">
				{sales ? (
					Object.values(sales).map(sale => <SaleCard key={sale.id} sale={sale} />)
				) : (
					[...Array(3).keys()].map(index => <SaleCardSkeleton key={index} />)
				)}
			</Box>
		</Container>
	);
}
