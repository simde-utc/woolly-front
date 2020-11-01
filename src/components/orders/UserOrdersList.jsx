import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux'
import actions, { apiAxios } from '../../redux/actions';

import {
	TableContainer, Table, TableHead, TableBody,
	TableRow, TableCell, Button, IconButton
} from '@material-ui/core';
import { Link } from '../common/Nav';

import OrderLinesList from './OrderLinesList';
import { ORDER_STATUS, ORDER_ACTIONS, API_URL } from '../../constants';


function getStatusActions(dispatch, history, fetchOrders) {
	// TODO fetch the right order instead of fetching all orders
	return {
		download(event) {
			const orderId = event.currentTarget.getAttribute('data-order-id');
			window.open(`${API_URL}/orders/${orderId}/pdf?download`, '_blank');
		},

		modify(event) {
			const orderId = event.currentTarget.getAttribute('data-order-id');
			history.push(`/orders/${orderId}`);
		},

		pay(event) {
			const saleId = event.currentTarget.getAttribute('data-sale-id');
			history.push(`/sales/${saleId}`);
		},

		cancel(event) {
			const orderId = event.currentTarget.getAttribute('data-order-id');
			const action = actions.orders(orderId).delete();
			dispatch(action);
			action.payload.finally(fetchOrders);
		},

		updateStatus(event) {
			const orderId = event.currentTarget.getAttribute('data-order-id');
			apiAxios.get(`/orders/${orderId}/status`).then(resp => {
				if (resp.updated)
					fetchOrders();
			});
		},
	};
};


function ActionButton({ order, text, Icon, onClick }) {
	return (
		<IconButton
			size="small"
			title={text}
			onClick={onClick}
			data-order-id={order.id}
			data-sale-id={order.sale.id}
		>
			<Icon title={text} />
		</IconButton>
	);
}

ActionButton.propTypes = {
	order: PropTypes.object.isRequired,
	text: PropTypes.string.isRequired,
	Icon: PropTypes.object.isRequired,
	onClick: PropTypes.func.isRequired,
};


function ActionOrderRow({ order, actions }) {
	const status = ORDER_STATUS[order.status] || {};
	return (
		<TableRow>
			<TableCell>
				<Link to={`/orders/${order.id}`}>{order.id}</Link>
			</TableCell>
			<TableCell>
				{order.sale && order.sale.name}
			</TableCell>
			<TableCell align="center">
				<Button
					onClick={actions.updateStatus}
					style={{ color: status.color, cursor: 'pointer' }}
					data-order-id={order.id}
				>
					{status.label}
				</Button>
			</TableCell>
			<TableCell align="center">
				{status.actions.map(key => (
					<ActionButton
						key={key}
						order={order}
						onClick={actions[key].bind(actions)}
						{...ORDER_ACTIONS[key]}
					/>
				))}
			</TableCell>
			<TableCell>
				<OrderLinesList
					orderlines={order.orderlines}
					disablePadding
					dense
				/>
			</TableCell>
		</TableRow>
	);
}

ActionOrderRow.propTypes = {
	order: PropTypes.object.isRequired,
	actions: PropTypes.object.isRequired,
};


export default function UserOrdersList({ orders, fetchOrders, ...props }) {
	const dispatch = useDispatch();
	const history = useHistory();
	const statusActions = getStatusActions(dispatch, history, fetchOrders);
	return (
		<TableContainer>
			<Table {...props}>
				<TableHead>
					<TableRow>
						<TableCell>N°</TableCell>
						<TableCell>Vente</TableCell>
						<TableCell align="center">Statut</TableCell>
						<TableCell align="center">Actions</TableCell>
						<TableCell>Articles</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.values(orders).map(order => (
						<ActionOrderRow
							key={order.id}
							order={order}
							actions={statusActions}
						/>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

UserOrdersList.propTypes = {
	orders: PropTypes.object.isRequired,
};
