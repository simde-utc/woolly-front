import React from "react";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../../../redux/hooks";

import { parseISO } from "date-fns";
import { formatDate } from "../../../utils";
import { ORDER_STATUS } from "../../../constants";

import APIDataTable from "../../../components/common/APIDataTable";
import OrderLinesList from "../../../components/orders/OrderLinesList";
import { Link } from "../../../components/common/Nav";

export default function OrdersList({ saleId, items, ...props }) {
	const dispatch = useDispatch();
	return (
		<APIDataTable
			title="Commandes"
			path={["sales", saleId, "orders"]}
			queryParams={{ include: "owner,orderlines" }}
			transformData={orders => orders.map((order) => ({
				id: order.id,
				owner: `${order.owner.first_name} ${order.owner.last_name}`,
				updated_at: parseISO(order.updated_at),
				status: ORDER_STATUS[order.status] || {},
				orderlines: order.orderlines,
			}))}
			columns={[
				{
					title: "ID",
					field: "id",
					render: (order) => (
						<Link to={`/orders/${order.id}`}>{order.id}</Link>
					),
				},
				{
					title: "Acheteur",
					field: "owner",
				},
				{
					title: "Status",
					field: "status",
					render: (order) => (
						<span
							onClick={(event) => updateOrderStatus(dispatch, order.id, { fetch: true })}
							style={{ color: order.status && order.status.color, cursor: "pointer" }}
						>
							{(order.status && order.status.label) || "Inconnu"}
						</span>
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
			]}
		/>
	);
}
