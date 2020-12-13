import React from "react";
import { useStoreAPIData } from "redux/hooks";
import { formatDate } from "utils/format";

import { Box, Container, Grid, Chip, Tabs, Tab } from "@material-ui/core";
import { PlayArrow, Pause, Public, Lock } from "@material-ui/icons";

import Stat from "components/common/Stat";
import { Link } from "components/common/Nav";
import { CopyButton } from "components/common/Buttons";

import QuantitiesSold from "./QuantitiesSold";
import OrdersTable from "./OrdersTable";
import TicketsList from "./TicketsList";


export default function SaleDetail(props) {
	const [tab, setTab] = React.useState("quantities");

	const saleId = props.match.params.sale_id;
	const { data: sale, fetched } = useStoreAPIData(["sales", saleId], { include: "association" }, { singleElement: true });
	const items = useStoreAPIData(["sales", saleId, "items"], { page_size: 'max' });
	const itemgroups = useStoreAPIData(["sales", saleId, "itemgroups"], { page_size: 'max' });

	// TODO Better loader
	if (!fetched)
		return "Loading"

	const saleLink = window.location.href.replace("/admin/", "/");
	const chipMargin = { marginBottom: 4, marginRight: 4 };
	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item xs={12} md={3}>
					<Grid container spacing={2} justify="center">
						<Grid item xs="auto" md={12}>
							<h4 style={{ marginTop: 0 }}>Organisé par {sale.association && sale.association.shortname}</h4>
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
						onChange={(event, newTab) => setTab(newTab)}
						variant="fullWidth"
						centered
					>
						<Tab value="quantities" label="Quantités vendues" />
						<Tab value="tickets" label="Liste des billets" />
						<Tab value="orders" label="Liste des commandes" />
						<Tab value="chart" label="Graphique des ventes" />
					</Tabs>

					<Box py={2}>
						{(tab === "quantities" && (
							<React.Fragment>
								<Box display="flex" justifyContent="space-evenly" mt={2} mb={4}>
									<Stat title="Places vendues" value={480} max={1000} />
									<Stat title="Argent récolté" value={1050} unit="€" />
								</Box>
								<QuantitiesSold
									items={items.data}
									itemgroups={itemgroups.data}
									fetched={items.fetched && itemgroups.fetched}
								/>
							</React.Fragment>
						)) || (tab === "orders" && (
							<OrdersTable
								saleId={saleId}
								items={items.data}
							/>
						)) || (tab === "tickets" && (
							<TicketsList
								saleId={saleId}
								items={items.data}
								itemgroups={itemgroups.data}
								fetched={items.fetched}
							/>
						)) || (tab === "chart" && (
							<p>À venir...</p>
						))}
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
