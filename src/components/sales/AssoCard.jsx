import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardActions, CardMedia, CardHeader } from '@material-ui/core';
import { NavButton } from '../common/Nav.jsx';


class AssoCard extends React.Component {
	render() {
		const { asso, classes } = this.props;
		return (
		<Card className={classes.card}>
			
			<CardHeader title={asso.shortname} className={classes.header}></CardHeader>
			<CardContent className={classes.content}>
				<CardMedia className={classes.img} title="logo_asso">
					<img src={asso.image} alt={asso.name} height="75px" />
				</CardMedia>
				
			</CardContent>
			<CardActions>
				<NavButton to={`/admin/assos/${asso.id}`}>Voir les ventes</NavButton>
			</CardActions>
		</Card>
		);
	}
}

AssoCard.propTypes = {
	asso: PropTypes.object.isRequired,
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
	img:{
		textAlign: 'center'
	},
	header : {
		height: '75px',
		textAlign: 'center',
		backgroundColor: '#f7f7f7'
	}
}

export default withStyles(styles)(AssoCard);
