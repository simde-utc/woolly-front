import React from 'react';
import { Container } from '@material-ui/core';
import { Explore } from '@material-ui/icons';
import { NavButton } from '../components/common/Nav';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	container: {
		paddingTop: theme.spacing(4),
		textAlign: 'center',
	},
	error: {
		margin: 0,
		fontSize: '10rem',
		color: 'rgba(0,0,0,.15)',
		fontWeight: 1000,
	},
	title: {
		margin: 0,
		marginBottom: theme.spacing(3),
	},
}));

export default function Error404(props) {
	const classes = useStyles();
	return (
		<Container className={classes.container}>
				<span className={classes.error}>404</span>
				<h1 className={classes.title}>Cette page n'existe&nbsp;pas&nbsp;!</h1>
				<NavButton to="/" startIcon={<Explore />} size="large">
					Retourner à l'accueil
				</NavButton>
		</Container>
	);
}
