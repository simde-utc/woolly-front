import React from "react";
import apiActions from "../../redux/actions/api";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid } from "@material-ui/core";

import AssoSalesList from "../../components/sales/AssoSalesList";

export default function Dashboard(props) {
	const dispatch = useDispatch();
	const assos = useSelector(store => store.api.getAuthRelatedData("associations", {}));
	const sales = useSelector(store => store.api.getResourceDataById("associations", "sales", null));

	function fetchSales(assoId, page = 1) {
		dispatch(apiActions.associations(assoId).sales.all({ page, include_inactive: true }));
	}

	return (
		<Container>
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
						fetchSales={fetchSales}
					/>
				</Grid>
			</Grid>
		</Container>
	);
}
