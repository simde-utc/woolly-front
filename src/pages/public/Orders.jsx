import React from 'react'
import { useUserOrders } from '../../redux/hooks';

import { Container, Box } from '@material-ui/core';
import UserOrdersList from '../../components/orders/UserOrdersList';
import Loader from '../../components/common/Loader';


export default function Orders(props) {
	const { orders, fetchOrders } = useUserOrders();
	return (
		<Container>
			<h1>Mes commandes</h1>

			<Loader fluid loading={orders === undefined} text="Récupération des commandes en cours...">
				<Box display="flex" flexWrap="wrap">
					<UserOrdersList
						orders={orders}
						fetchOrders={fetchOrders}
					/>
				</Box>
			</Loader>
		</Container>
	);
}
