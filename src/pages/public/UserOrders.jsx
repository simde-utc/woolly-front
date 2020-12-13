import React from "react"
import { useSelector } from "react-redux";
import OrdersTable from "../../components/orders/OrdersTable";
import Loader from "../../components/common/Loader";
import { Container, Box } from "@material-ui/core";


export default function UserOrders(props) {
	const userId = useSelector(store => store.api.getAuthUser("id", null));
	return (
		<Box clone py={3}>
			<Container>
				<Loader fluid loading={userId == null} text="Récupération des commandes en cours...">
					<OrdersTable
						title={<h1>Mes commandes</h1>}
						path={["auth", "orders"]}
						show={["sale", "items", "actions"]}
						apiOptions={{ uri: `/users/${userId}/orders` }}
					/>
				</Loader>
			</Container>
		</Box>
	);
}
