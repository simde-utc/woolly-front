import React from 'react'
import actions from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid } from '@material-ui/core';

import AssoSalesList from '../../components/sales/AssoSalesList';


export default function Dashboard(props) {
	const dispatch = useDispatch();
	const assos = useSelector(store => store.getAuthRelatedData('associations', {}));
	const sales = useSelector(store => store.getResourceDataById('associations', 'sales', null));

	function handleFetchSales(assoId) {
		dispatch(actions.associations(assoId).sales.all({ include_inactive: true }));
	}

	return (
		<Container>
			<h1>Admin - Dashboard</h1>

			<Grid container spacing={3} wrap="wrap">
				<Grid item xs={12} sm={6}>
					<h2>Dernières ventes</h2>
					<p>TODO</p>
				</Grid>

				<Grid item xs={12} sm={6}>
					<h2>Mes associations</h2>
					<AssoSalesList
						assos={assos}
						sales={sales}
						fetchSales={handleFetchSales}
					/>
				</Grid>
			</Grid>
		</Container>
	);
}
