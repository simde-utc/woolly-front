import React from 'react';
import { useStoreAPIData } from '../../../redux/hooks';

import { Box, Container, Grid, Chip, Tabs, Tab } from '@material-ui/core';
import { PlayArrow, Pause, Public, Lock } from '@material-ui/icons';

import Stat from '../../../components/common/Stat';
import { Link } from '../../../components/common/Nav';
import { CopyButton } from '../../../components/common/Buttons';

import QuantitiesSold from './QuantitiesSold';
import OrdersList from './OrdersList';
import TicketsList from './TicketsList';


export default function SaleDetail(props) {
	const [tab, setTab] = React.useState('quantities');

	const saleId = props.match.params.sale_id;
	const sale = useStoreAPIData(['sales', saleId], { queryParams: { include: 'association' } });
	const items = useStoreAPIData(['sales', saleId, 'items']);
	const itemgroups = useStoreAPIData(['sales', saleId, 'itemgroups']);

	if (!sale)
		return "Loading"

	const saleLink = window.location.href.replace('/admin/', '/');
	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item xs={12} md={3}>
					<Grid container spacing={2} justify="center">
						<Grid item xs="auto" md={12}>
							<h4>Organisé par {sale.association && sale.association.shortname}</h4>
							<div>
								{sale.is_active
									? <Chip style={{ margin: 4 }} label="Active" color="primary" icon={<PlayArrow />} />
									: <Chip style={{ margin: 4 }} label="Inactive" icon={<Pause />} />
								}
								{sale.is_public
									? <Chip style={{ margin: 4 }} label="Publique" color="primary" icon={<Public />} />
									: <Chip style={{ margin: 4 }} label="Privée" icon={<Lock />} />
								}
							</div>
						</Grid>
						<Grid item xs="auto" md={12}>
							<h4>Liens</h4>
							<ul>
								<li><CopyButton value={saleLink}>Partager la vente</CopyButton></li>
								{sale.cgv
									? <li><Link href={sale.cgv} rel="noopener" target="_blank">CGV</Link></li>
									: <li>Pas de CGV !!</li>
								}
							</ul>
						</Grid>
						<Grid item xs="auto" sm md={12}>
							<h4>Description</h4>
							<p>{sale.description}</p>
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
								<Box display="flex" justifyContent="space-evenly" mt={2} mb={4}>
									<Stat title="Places vendues" value={480} max={1000} />
									<Stat title="Argent récolté" value={1050} unit="€" />
								</Box>
								<QuantitiesSold
									items={items}
									itemgroups={itemgroups}
								/>
							</React.Fragment>
						)) || (tab === 'orders' && (
							<OrdersList
								saleId={sale.id}
								items={items}
							/>
						)) || (tab === 'tickets' && (
							<TicketsList
								saleId={sale.id}
								items={items}
							/>
						)) || (tab === 'chart' && (
							<p>À venir...</p>
						))}
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}