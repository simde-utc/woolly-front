import React from "react";
import { useDispatch, useSelector } from "react-redux";
import apiActions from "../redux/actions/api";

import { Container, Grid, Box } from "@material-ui/core";
import { NavButton } from "../components/common/Nav";
import Loader from "../components/common/Loader";

import AccountDetails from "../components/users/AccountDetails";
import UserOrdersList from "../components/orders/UserOrdersList";


export default function Account(props) {
	const dispatch = useDispatch();
	const user = useSelector(store => store.api.getAuthUser());
	const orders = useSelector(store => store.api.getAuthRelatedData("lastOrders", undefined));

	React.useEffect(() => {
		if (user.id) {
			dispatch(
				apiActions.authUser(user.id).orders
				.configure(action => action.path = ["auth", "lastOrders"])
				.all({
					order_by: "-id",
					page_size: 5,
					filter: { status__in: [1,2,3,4] },
					include: 'sale,orderlines,orderlines__item,orderlines__orderlineitems',
				})
			)
		}
	}, [dispatch, user.id]);

	return (
		<Container>
			<h1>Mon Compte</h1>

			<Grid container spacing={2}>
				<Grid item md={4}>
					<h2>Mes informations</h2>
					<AccountDetails user={user} />
				</Grid>

				<Grid item xs={12} md={8}>
					<h2>Mes 5 dernières commandes</h2>
					<Loader loading={orders == null}>
						<UserOrdersList orders={orders} />
						<Box mt={4} mb={2} textAlign="center">
							<NavButton to="/orders">Voir toutes mes commandes</NavButton>
						</Box>
					</Loader>
				</Grid>
			</Grid>
		</Container>
	);
}
