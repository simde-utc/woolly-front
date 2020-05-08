import React from 'react'

import { useDispatch, useSelector } from 'react-redux';
import actions from '../../redux/actions';
import { Container, Box } from '@material-ui/core';

import Loader from '../../components/common/Loader';
import OrdersList from '../../components/orders/OrdersList';


function fetchOrders(dispatch, userId) {
	dispatch(
		actions.defineUri(`users/${userId}/orders`)
		       .definePath(['auth', 'orders'])
		       .all({ include: 'sale,orderlines,orderlines__item,orderlines__orderlineitems' })
	);
}

export default function Orders(props) {
	const dispatch = useDispatch();
	const userId = useSelector(store => store.getAuthUser('id', null));
	const orders = useSelector(store => store.getAuthRelatedData('orders', undefined));

	React.useEffect(() => {
		if (userId)
			fetchOrders(dispatch, userId);
	}, [dispatch, userId]);

	return (
		<Container>
			<h1>Mes commandes</h1>

			<Loader fluid loading={orders === undefined} text="Récupération des commandes en cours...">
				<Box display="flex" flexWrap="wrap">
					<OrdersList
						orders={Object.values(orders)}
						updateOrders={() => fetchOrders(dispatch, userId)}
					/>
				</Box>
			</Loader>
		</Container>
	);
}
