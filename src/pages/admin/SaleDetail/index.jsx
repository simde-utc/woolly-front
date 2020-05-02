import React from 'react';
import { useStoreAPIData } from '../../../redux/hooks';

import { Container, Grid, Chip, CircularProgress } from '@material-ui/core';
import { PlayArrow, Pause, Public, Lock } from '@material-ui/icons';

import { Link } from '../../../components/common/Nav';
import { CopyButton } from '../../../components/common/Buttons';
import Stat from '../../../components/common/Stat';


export default function SaleDetail(props) {
	const saleId = props.match.params.sale_id;
	const sale = useStoreAPIData(['sales', saleId], { queryParams: { include: 'association' } });
	const items = useStoreAPIData(['sales', saleId, 'items']);
	const itemgroups = useStoreAPIData(['sales', saleId, 'itemgroups']);

	window.data = { sale, items, itemgroups }

	if (!sale)
		return "Loading"

	window.props = props
	const saleLink = window.location.href.replace('/admin/', '/');
	return (
		<Container>
			<Grid container>
				<Grid item style={{ flex: 1 }}>
					<h1>{sale.name}</h1>
					<p>Organisé par {sale.association && sale.association.shortname}</p>

					{sale.is_active
						? <Chip label="Active" color="primary" icon={<PlayArrow />} />
						: <Chip label="Inactive" icon={<Pause />} />
					}
					{sale.is_public
						? <Chip label="Publique" icon={<Public />} />
						: <Chip label="Privée" icon={<Lock />} />
					}
				</Grid>
				<Grid item style={{ flex: 0 }}>
					<Stat value={480} max={1000} />
					<Stat value={`${1050}€`} />
				</Grid>
			</Grid>

			<hr/>
			<p>Timeline</p>

			<Grid container>
				<Grid item sm={4}>
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
				<Grid item>
					Stats
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