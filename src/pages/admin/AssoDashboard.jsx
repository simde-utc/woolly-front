import React from 'react'
import { useStoreAPIData } from '../../redux/hooks';

import { Container, Grid, Box } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab';
import SalesList from '../../components/sales/SalesList';
import DetailsTable from '../../components/common/DetailsTable';

export default function AssoDashboard(props) {
	const assoId = props.match.params.asso_id;
	const asso = useStoreAPIData(['associations', assoId]);
	const sales = useStoreAPIData(['associations', assoId, 'sales']);

	return (
		<Container>
			<Grid container spacing={3}>
				<Grid item md={6}>
					<h2>Informations</h2>
					{asso && !asso.fun_id && (
						<Box clone mb={2}>
							<Alert severity="warning">
								<AlertTitle>Configuration de l'association non complète</AlertTitle>
								<p>
									L'attribut <code>fun_id</code> de l'association n'est pas défini.
									Veuillez contacter un administrateur pour terminer la configuration.
								</p>
							</Alert>
						</Box>
					)}
					<DetailsTable
						data={asso}
						labels={{
							shortname: 'Nom',
							fun_id: 'fun_id',
						}}
					/>
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
