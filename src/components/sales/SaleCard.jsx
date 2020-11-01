import React from 'react';
import PropTypes from 'prop-types';
import { shorten } from '../../utils';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CardActions } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { NavButton } from '../common/Nav';


const useStyles = makeStyles(theme => ({
	card: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		'&:hover': {
			boxShadow: theme.shadows[4],
		},
		'&:hover .go-to-sale': {
			color: theme.palette.primary.main,
		},
	},
	content: {
		flex: 1,
	},
	title: {
		fontSize: 24,
		margin: 0,
	},
	subtitle: {
		fontStyle: 'italic',
	},
	description: {
		textAlign: 'justify',
	},
}));

export function SaleCardSkeleton() {
	const classes = useStyles();
	return (
		<Grid item xs={12} sm={4} md={3}>
			<Card className={classes.card}>
				<CardContent className={classes.content}>
					<Skeleton variant="rect" width={230} height={34} style={{ marginBottom: 2 }} />
					<Skeleton variant="rect" width={150} height={16} />
					<Skeleton variant="text" />
					<Skeleton variant="text" />
					<Skeleton variant="text" />
				</CardContent>

				<CardActions>
					<Skeleton variant="rect" width={160} height={30} />
				</CardActions>
			</Card>
		</Grid>
	);
}

export default function SaleCard({ sale, ...props }) {
	const classes = useStyles();
	return (
		<Grid item xs={12} sm={6} md={4} lg={3}>
			<Card className={classes.card}>
				<CardContent className={classes.content}>
					<h4 className={classes.title}>
						{sale.name}
					</h4>
					<span className={classes.subtitle}>
						Par {sale.association && sale.association.shortname}
					</span>
					<p className={classes.description}>
						{shorten(sale.description, 150)}
					</p>
				</CardContent>

				<CardActions>
					<NavButton className="go-to-sale" to={`/sales/${sale.id}`}>
						Accéder à la vente
					</NavButton>
				</CardActions>
			</Card>
		</Grid>
	);
}

SaleCard.propTypes = {
	sale: PropTypes.object.isRequired,
};
