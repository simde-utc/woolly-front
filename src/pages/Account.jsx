import React from 'react';
import { useSelector } from 'react-redux';
import { useUserOrders } from '../redux/hooks';

import { Container, Grid } from '@material-ui/core';
import Loader from '../components/common/Loader';

import AccountDetails from '../components/users/AccountDetails';
import UserOrdersList from '../components/orders/UserOrdersList';


export default function Account(props) {
	const user = useSelector(store => store.api.getAuthUser());
	const { orders, fetchOrders } = useUserOrders();

	return (
		<Container>
			<h1>Mon Compte</h1>

			<Grid container spacing={2}>
				<Grid item md={4}>
					<h2>Mes informations</h2>
					<AccountDetails user={user} />
				</Grid>

				<Grid item xs={12} md={8}>
					<h2>Mes commandes</h2>
					<Loader loading={orders === undefined}>
						<UserOrdersList
							orders={orders}
							fetchOrders={fetchOrders}
						/>
					</Loader>
				</Grid>
			</Grid>
		</Container>
	);
}
