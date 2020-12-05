import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";

import { formatDate } from "utils/format";
import { updateOrderStatus, getStatusActions } from "utils/api";
import { ORDER_STATUS, ORDER_ACTIONS } from "utils/constants";

import APIDataTable from "components/common/APIDataTable";
import { Link } from "components/common/Nav";
import { OrderStatusButton, OrderActionButton } from "./OrderButtons";
import OrderLinesList from "./OrderLinesList";


export default function OrdersTable({ items, show, queryParams = {}, ...props }) {
	const dispatch = useDispatch();
	const history = useHistory();
	const statusActions = getStatusActions(dispatch, history);

	// Specify columns
	const showMap = new Set(show);
	const columns = [
		{
			title: "N°",
			field: "id",
			render: (order) => (
				<Link to={`/orders/${order.id}`}>{order.id}</Link>
			),
		},
		{
			title: "Acheteur",
			field: "owner",
			hidden: !showMap.has("owner"),
		},
		{
			title: "Vente",
			field: "sale",
			hidden: !showMap.has("sale"),
			render: (order) => (
				<Link to={`/sales/${order.sale?.id}`}>{order.sale?.name}</Link>
			),
		},
		{
			title: "Status",
			field: "status",
			render: (order) => (
				<OrderStatusButton
					status={order.status}
					updateStatus={() => updateOrderStatus(dispatch, order.id, { fetch: true })}
					variant="button"
				/>
			),
		},
		{
			title: "Action",
			field: "status",
			searchable: false,
			hidden: !showMap.has("actions"),
			render: (order) => (
				<React.Fragment>
					{order.status?.actions?.map(key => (
						<OrderActionButton
							key={key}
							order={order}
							onClick={statusActions[key].bind(statusActions)}
							{...ORDER_ACTIONS[key]}
						/>
					))}
				</React.Fragment>
			),
		},
		{
			title: "Mise à jour",
			field: "updated_at",
			searchable: false,
			render: (order) => <span>{formatDate(order.updated_at, "datetime")}</span>,
		},
		{
			title: "Articles",
			field: "orderlines",
			searchable: false,
			render: (order) => (
				<OrderLinesList
					orderlines={order.orderlines}
					items={items}
					prefix="- "
					disablePadding
					dense
				/>
			),
		},
	];

	// Configure include query params
	let include = new Set((queryParams.include || '').split(''))
	if (showMap.has("items") && items === undefined)
		include.add("orderlines").add("orderlines__item")
	if (showMap.has("sale"))
		include.add("sale")
	if (showMap.has("owner"))
		include.add("owner")
	const _queryParams = { ...queryParams, include: Array.from(include).join(',') };

	return (
		<APIDataTable
			queryParams={_queryParams}
			columns={columns}
			transformData={orders => orders.map((order) => ({
				id: order.id,
				sale: order.sale,
				owner: order.owner ? `${order.owner.first_name} ${order.owner.last_name}` : null,
				updated_at: order.updated_at,
				status: ORDER_STATUS[order.status] || {},
				orderlines: order.orderlines,
			}))}
			{...props}
		/>
	);
}

OrdersTable.propTypes = {
	items: PropTypes.object,
	show: PropTypes.arrayOf(
		PropTypes.oneOf([
			"sale",
			"owner",
			"items",
			"actions",
		])
	),
};

OrdersTable.defaultProps = {
	items: undefined,
	show: [],
};
