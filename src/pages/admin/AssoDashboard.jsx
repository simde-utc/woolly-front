import React from 'react'
import actions from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';

import { Container, Grid } from '@material-ui/core'
import SalesList from '../../components/sales/SalesList';


export default function AssoDashboard(props) {
	const assoId = props.match.params.asso_id;
	const dispatch = useDispatch();
	const asso = useSelector(store => store.getData(['associations', assoId], null));
	const sales = useSelector(store => store.getData(['associations', assoId, 'sales'], null, false));

	React.useEffect(() => {
		if (!asso)
			dispatch(actions.associations.find(assoId));
		if (!sales)
			dispatch(actions.associations(assoId).sales.get());
	})

	return (
		<Container>
			<h1>Admin - Dashboard {asso ? asso.shortname : '...'}</h1>

			<Grid container spacing={3}>
				<Grid item md={6}>
					<h2>Informations</h2>
					<p>TODO</p>
				</Grid>

				<Grid item md={6}>
					<h2>Ventes</h2>
					<SalesList
						sales={sales}
						baseUrl="/admin"
						withEdit
						assoId={assoId}
					/>
				</Grid>
			</Grid>
		</Container>
	);
}
