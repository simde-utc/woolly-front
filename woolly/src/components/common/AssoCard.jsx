import React from 'react';
import PropTypes from 'prop-types';
import { shorten } from '../../utils';

import { withStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardActions, CardMedia, CardHeader } from '@material-ui/core';
import NavButton from './NavButton.jsx';


class AssoCard extends React.Component {
	render() {
		const { asso, classes } = this.props;
		return (
		<Card className={classes.card}>
			
			<CardHeader title={asso.name} className={classes.header}>
			</CardHeader>
			<CardContent className={classes.content}>
				<CardMedia className={classes.img} title="logo_asso">
					<img src={asso.image} height="75px" />
				</CardMedia>
				<p className={classes.description}>{shorten(asso.description, 150)}</p>
				
			</CardContent>
			<CardActions>
				<NavButton to={'/ventes/'+asso.id}>Consulter</NavButton>
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
