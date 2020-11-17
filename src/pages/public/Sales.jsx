import React from 'react'
import { useStoreAPIData } from '../../redux/hooks';

import { Container, Grid, Box, Button } from '@material-ui/core';
import SaleCard, { SaleCardSkeleton } from '../../components/sales/SaleCard';


export default function Sales(props) {
	const { data: sales, fetched, pagination, fetchData } = useStoreAPIData('sales', { include: 'association', order_by: '-begin_at' });
	return (
		<Container>
			<h1>Liste des ventes</h1>

			<Grid container spacing={2}>
				{fetched ? (
					Object.values(sales).map(sale => <SaleCard key={sale.id} sale={sale} />)
				) : (
					[...Array(3).keys()].map(index => <SaleCardSkeleton key={index} />)
				)}
			</Grid>
			{pagination && (
				<Box mt={3} textAlign="center">
					<Button
						disabled={pagination.lastFetched >= pagination.nbPages}
						onClick={() => fetchData(pagination.lastFetched + 1)}
					>
						Voir plus
					</Button>
				</Box>
			)}
		</Container>
	);
}
