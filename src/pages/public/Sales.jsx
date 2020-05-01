import React from 'react'
import { useStoreAPIData } from '../../redux/hooks';
import { makeStyles } from '@material-ui/core/styles';

import { Container } from '@material-ui/core';
import Loader from '../../components/common/Loader';
import SaleCard from '../../components/sales/SaleCard';

const useStyles = makeStyles({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		// overflowX: 'auto',
	}
});

export default function Sales(props) {
	const classes = useStyles();
	const sales = useStoreAPIData('sales', { queryParams: { include: 'association' }});

	return (
		<Container>
			<h1>Liste des ventes</h1>

			<Loader fluid loading={sales === undefined} text="Récupération des ventes en cours...">
				<div className={classes.container}>
					{Object.values(sales).map(sale => (
						<SaleCard key={sale.id} sale={sale} />
					))}
				</div>
			</Loader>
		</Container>
	);
}
