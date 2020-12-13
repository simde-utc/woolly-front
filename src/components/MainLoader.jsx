import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Loader from './common/Loader';


const useStyles = makeStyles({
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
		width: '100vw',
	},
});

export default function MainLoader(props) {

	const classes = useStyles();
	const auth = useSelector(store => store.api.get('auth'));

	// Fail if cannot get auth
	if (auth.error) {
		console.warn(auth.error)
		// TODO Deal with errors
		throw new Error("Impossible de contacter le serveur")
	}

	// Return children if has auth ready
	if (auth.fetched && auth.data && Object.entries(auth.data).length)
		return props.children;

	// Loader
	return (
		<div className={classes.container}>
			<h1>Woolly</h1>
			<Loader fluid={false} />
		</div>
	);
}
