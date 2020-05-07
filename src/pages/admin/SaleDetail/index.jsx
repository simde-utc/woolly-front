import React from 'react';
import { useStoreAPIData } from '../../../redux/hooks';

import { Box, Container, Grid, Chip, Tabs, Tab } from '@material-ui/core';
import { PlayArrow, Pause, Public, Lock } from '@material-ui/icons';

import { Link } from '../../../components/common/Nav';
import { CopyButton } from '../../../components/common/Buttons';
import Stat from '../../../components/common/Stat';
import QuantitiesSold from './QuantitiesSold';

export default function SaleDetail(props) {
	const [tab, setTab] = React.useState('quantities');

	const saleId = props.match.params.sale_id;
	const sale = useStoreAPIData(['sales', saleId], { queryParams: { include: 'association' } });
	const items = useStoreAPIData(['sales', saleId, 'items']);
	const itemgroups = useStoreAPIData(['sales', saleId, 'itemgroups']);

	window.data = { sale, items, itemgroups }

	if (!sale)
		return "Loading"

	const saleLink = window.location.href.replace('/admin/', '/');
	return (
		<Container>
			<h1>{sale.name}</h1>
			<p>Organisé par {sale.association && sale.association.shortname}</p>

			<hr/>

			<Grid container spacing={2}>
				<Grid item sm={4} md={3}>
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

					<h5>Description</h5>
					<p>{sale.description}</p>

					<h5>Liens</h5>
					<ul>
						<li><CopyButton value={saleLink}>Partager la vente</CopyButton></li>
						{sale.cgv
							? <li><Link href={sale.cgv}>CGV</Link></li>
							: <li>Pas de CGV !!</li>
						}
					</ul>
				</Grid>
				<Grid item xs>
					<Tabs
						value={tab}
						onChange={(event, newTab) => setTab(newTab)}
						variant="fullWidth"
						centered
					>
						<Tab value="quantities" label="Quantités vendues" />
						<Tab value="orders" label="Liste des ventes" />
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
							<p>Orders tab</p>
						)) || (tab === 'chart' && (
							<p>Chart tab</p>
						)) || (
							<p>Default tab</p>
						)}
					</Box>
				</Grid>
			</Grid>

			{/*
				QuantitiesSold
				weez
				OrdersStats
				OrdersList
					.perItem
					.search
			*/}
		</Container>
	);
}