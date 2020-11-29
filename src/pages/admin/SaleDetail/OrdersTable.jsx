import React from "react";
import Loader from "../../../components/common/Loader";
import OrdersTable from "../../../components/orders/OrdersTable";

export default function SaleOrders({ saleId, ...props }) {
	return (
		<Loader fluid loading={saleId == null} text="Récupération des commandes en cours...">
			<OrdersTable
				title="Commandes"
				path={["sales", saleId, "orders"]}
				show={["owner", "items"]}
			/>
		</Loader>
	);
}
