import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';


const useStyles = makeStyles({
	container: {
		// position: 'absolute',
		// bottom: 0,
		// left: 0,
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default function Footer(props) {
	const classes = useStyles();
	const simdeLink = <Link href="https://assos.utc.fr/assos/simde" target="_blank" rel="noopener">SiMDE</Link>;
	const contactLink = <Link href="/contact">Contact</Link>;
	return (
		<span className={classes.container} style={{ minHeight: 40 }}>
			Fait avec ♥ par le&nbsp;{simdeLink}.&nbsp;{contactLink}
		</span>
	);
}
