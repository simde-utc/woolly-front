import React from "react";
import { Route, Switch } from "react-router-dom";
import { useStoreAPIData } from "redux/hooks";
import { formatDate } from "utils/format";

import { Box, Container, Grid, Chip, Tabs, Tab } from "@material-ui/core";
import { PlayArrow, Pause, Public, Lock } from "@material-ui/icons";

import Loader from "components/common/Loader";
import { Link } from "components/common/Nav";
import { CopyButton } from "components/common/Buttons";

import QuantitiesSold from "./QuantitiesSold";
import OrdersTable from "./OrdersTable";
import TicketsList from "./TicketsList";


export default function SaleDetail(props) {
	const { sale_id: saleId, view: tab } = props.match.params;
	const { data: sale, fetched } = useStoreAPIData(["sales", saleId], { include: "association" }, { singleElement: true });
	const items = useStoreAPIData(["sales", saleId, "items"], { page_size: "max", with: "quantity_sold" });
	const itemgroups = useStoreAPIData(["sales", saleId, "itemgroups"], { page_size: "max" });

	if (!fetched)
		return <Loader fluid text="Chargement de la vente..." />;

	const saleLink = window.location.href.replace("/admin/", "/");
	const chipMargin = { marginBottom: 4, marginRight: 4 };
	const basePath = props.location.pathname.split("/").slice(0, -1).join("/");
	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item xs={12} md={3}>
					<Grid container spacing={2} justify="center">
						<Grid item xs="auto" md={12}>
							<h4 style={{ marginTop: 0 }}>Organisé par {sale?.association?.shortname || "..."}</h4>
							<div>
								{sale.is_active
									? <Chip style={chipMargin} label="Active" color="primary" icon={<PlayArrow />} />
									: <Chip style={chipMargin} label="Inactive" icon={<Pause />} />
								}
								{sale.is_public
									? <Chip style={chipMargin} label="Publique" color="primary" icon={<Public />} />
									: <Chip style={chipMargin} label="Privée" icon={<Lock />} />
								}
							</div>
						</Grid>
						<Grid item xs="auto" md={12}>
							<h4 style={{ marginTop: 0 }}>Dates</h4>
							<ul>
								<li>Ouverture: {sale.begin_at ? formatDate(sale.begin_at, "datetime") : "Inconnue"}</li>
								<li>Fermeture: {sale.end_at ? formatDate(sale.end_at, "datetime") : "Inconnue"}</li>
							</ul>
						</Grid>
						<Grid item xs="auto" md={12}>
							<h4 style={{ marginTop: 0 }}>Liens</h4>
							<ul>
								<li><CopyButton value={saleLink}>Partager la vente</CopyButton></li>
								{sale.cgv
									? <li><Link href={sale.cgv} rel="noopener" target="_blank">CGV</Link></li>
									: <li>Pas de CGV !!</li>
								}
							</ul>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs md={9}>
					<Tabs
						value={tab}
						onChange={(event, newTab) => props.history.push(`${basePath}/${newTab}`)}
						variant="fullWidth"
						centered
					>
						<Tab value="quantities" label="Quantités vendues" />
						<Tab value="tickets" label="Liste des billets" />
						<Tab value="orders" label="Liste des commandes" />
						<Tab value="charts" label="Graphiques des ventes" disabled />
					</Tabs>
					<Box py={2}>
						<Switch>
							<Route exact path={`${basePath}/quantities`} render={(routeProps) => (
								<QuantitiesSold
									max_item_quantity={sale.max_item_quantity}
									items={items.data}
									itemgroups={itemgroups.data}
									fetched={items.fetched && itemgroups.fetched}
									{...routeProps}
								/>
							)} />
							<Route exact path={`${basePath}/tickets`} render={(routeProps) => (
								<TicketsList
									saleId={saleId}
									items={items.data}
									itemgroups={itemgroups.data}
									fetched={items.fetched}
									{...routeProps}
								/>
							)} />
							<Route exact path={`${basePath}/orders`} render={(routeProps) => (
								<OrdersTable
									saleId={saleId}
									items={items.data}
									{...routeProps}
								/>
							)} />
							<Route exact path={`${basePath}/charts`} render={(routeProps) => (
								<p>À venir...</p>
							)} />
						</Switch>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
