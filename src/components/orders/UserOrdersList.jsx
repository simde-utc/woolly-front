import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { getStatusActions } from "utils/api";
import { ORDER_STATUS, ORDER_ACTIONS } from "utils/constants";

import {
	TableContainer, Table, TableHead, TableBody,
	TableRow, TableCell
} from "@material-ui/core";
import { Link } from "components/common/Nav";
import OrderLinesList from "./OrderLinesList";
import { OrderStatusButton, OrderActionButton } from "./OrderButtons";


function UserOrderRow({ order, actions }) {
	const status = ORDER_STATUS[order.status] || {};
	return (
		<TableRow>
			<TableCell>
				<Link to={`/orders/${order.id}`}>{order.id}</Link>
			</TableCell>
			<TableCell>
				{order.sale?.name}
			</TableCell>
			<TableCell align="center">
				<OrderStatusButton
					status={status}
					updateStatus={actions.updateStatus}
					data-order-id={order.id}
				/>
			</TableCell>
			<TableCell align="center">
				{status.actions.map(key => (
					<OrderActionButton
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

UserOrderRow.propTypes = {
	order: PropTypes.object.isRequired,
	actions: PropTypes.object.isRequired,
};


export default function UserOrdersList({ orders, ...props }) {
	const dispatch = useDispatch();
	const history = useHistory();
	const statusActions = getStatusActions(dispatch, history);
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
						<UserOrderRow
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
