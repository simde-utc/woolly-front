import React from 'react';
import { useStoreAPIData } from '../../../redux/hooks';

import { Box, Container, Grid, Chip, Tabs, Tab } from '@material-ui/core';
import { PlayArrow, Pause, Public, Lock } from '@material-ui/icons';

import { Link } from '../../../components/common/Nav';
import { CopyButton } from '../../../components/common/Buttons';
import Stat from '../../../components/common/Stat';

import QuantitiesSold from './QuantitiesSold';
import OrdersList from './OrdersList';
import TicketsList from './TicketsList';


export default function SaleDetail(props) {
	const [tab, setTab] = React.useState('tickets');

	const saleId = props.match.params.sale_id;
	const sale = useStoreAPIData(['sales', saleId], { queryParams: { include: 'association' } });
	const items = useStoreAPIData(['sales', saleId, 'items']);
	const itemgroups = useStoreAPIData(['sales', saleId, 'itemgroups']);
    const orders = useStoreAPIData(['sales', saleId, 'orders'], { queryParams: { include: 'owner,orderlines,orderlines__orderlineitems,orderlines__orderlineitems__orderlinefields' } });

	window.data = { sale, items, itemgroups, orders }

	if (!sale)
		return "Loading"

	const saleLink = window.location.href.replace('/admin/', '/');
	return (
		<Container>
			<h1>{sale.name}</h1>

			<Grid container spacing={2}>
				<Grid item xs md={3}>
					<Grid container spacing={1}>
						<Grid item xs md={12}>
							<p>Organisé par {sale.association && sale.association.shortname}</p>
							<div>
								{sale.is_active
									? <Chip label="Active" color="primary" icon={<PlayArrow />} />
									: <Chip label="Inactive" icon={<Pause />} />
								}
								{sale.is_public
									? <Chip label="Publique" icon={<Public />} />
									: <Chip label="Privée" icon={<Lock />} />
								}
							</div>
						</Grid>
						<Grid item xs md={12}>
							<h5>Description</h5>
							<p>{sale.description}</p>
						</Grid>
						<Grid item xs md={12}>
							<h5>Liens</h5>
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
						{(tab === 'quantities' && (
							<React.Fragment>
								<Box display="flex" justifyContent="space-evenly" mb={2}>
									<Stat value={480} max={1000} />
									<Stat value={`${1050}€`} />
								</Box>
								<QuantitiesSold
									items={items}
									itemgroups={itemgroups}
								/>
							</React.Fragment>
						)) || (tab === 'orders' && (
							<React.Fragment>
								<p>Search + Pagination </p>
								<OrdersList
									orders={orders}
									items={items}
								/>
							</React.Fragment>
						)) || (tab === 'tickets' && (
							<React.Fragment>
								<TicketsList
									saleId={sale.id}
									items={items}
								/>
							</React.Fragment>
						)) || (tab === 'chart' && (
							<p>Chart tab</p>
						)) || (
							<p>Default tab</p>
						)}
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}