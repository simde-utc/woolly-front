import React from 'react';
import PropTypes from 'prop-types';
import { shorten } from '../../utils';

import { withStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardActions } from '@material-ui/core';
import NavButton from './NavButton.jsx';


class SaleCard extends React.Component {
	render() {
		const { sale, classes } = this.props;
		return (
		<Card className={classes.card}>
			<CardContent className={classes.content}>
				<h4 className={classes.title}>{sale.name}</h4>
				<span className={classes.subtitle}>Par {sale.association.name}</span>
				<p className={classes.description}>{shorten(sale.description, 150)}</p>

			</CardContent>
			<CardActions>
				<NavButton to={'/ventes/'+sale.id}>Accéder à la vente</NavButton>
			</CardActions>
		</Card>
		);
	}
}

SaleCard.propTypes = {
	sale: PropTypes.object.isRequired,
}

const styles = {
	card: {
		width: 300,
		margin: '0 0.5em 0.5em 0',
		display: 'flex',
		flexDirection: 'column',
	},
	content: {
		paddingTop: 24,
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
}

export default withStyles(styles)(SaleCard);
