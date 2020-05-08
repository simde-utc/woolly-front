import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useHistory } from 'react-router';

import {
	TableContainer, Table, TableHead, TableBody,
	TableRow, TableCell, Button,
} from '@material-ui/core';

import OrderLinesList from './OrderLinesList';
import { ORDER_STATUS, ORDER_ACTIONS } from '../../constants';


const STATUS_ACTIONS = {

	download(event) {
		const orderId = event.currentTarget.getAttribute('data-order-id');
		window.open(`${axios.defaults.baseURL}/orders/${orderId}/pdf?download`, '_blank');
	},

	modify(event) {
		const orderId = event.currentTarget.getAttribute('data-order-id');
		this.goto(`/orders/${orderId}`);
	},

	pay(event) {
		const saleId = event.currentTarget.getAttribute('data-sale-id');
		this.goto(`/sales/${saleId}`);
	},

	cancel(event) {
		const orderId = event.currentTarget.getAttribute('data-order-id');
		axios.delete(`/orders/${orderId}`, { withCredentials: true })
		     .then(this.updateOrders);
	},
};


function ActionButton({ order, text, Icon, onClick }) {
	return (
		<Button
			size="small"
			title={text}
			onClick={onClick}
			data-order-id={order.id}
			data-sale-id={order.sale.id}
		>
			<Icon title={text} />
		</Button>
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
				{order.sale && order.sale.name}
			</TableCell>
			<TableCell align="center">
				<span style={{ color: status.color }}>{status.label}</span>
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


export default function UserOrdersList({ orders, updateOrders, ...props }) {

	const history = useHistory();
	const actions = {
		...STATUS_ACTIONS,
		updateOrders,
		goto: history.push,
	};

	return (
		<TableContainer>
			<Table {...props}>
				<TableHead>
					<TableRow>
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
							actions={actions}
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
