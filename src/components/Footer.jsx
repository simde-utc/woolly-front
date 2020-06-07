import React from 'react'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Link } from '@material-ui/core';


const useStyles = makeStyles({
	container: {
		position: 'fixed',
		bottom: 0,
		left: 0,
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffffff',
	},
});

export default function Footer({ height }) {
	const classes = useStyles();
	const simdeLink = <Link href="https://assos.utc.fr/assos/simde" target="_blank" rel="noopener">SiMDE</Link>;
	const contactLink = <Link href="mailto:simde@assos.utc.fr">Contact</Link>;
	return (
		<Paper square elevation={4} className={classes.container} style={{ height }}>
			<span>
				Fait avec ♥ par le {simdeLink}. {contactLink}
			</span>
		</Paper>
	);
}

Footer.propTypes = {
	height: PropTypes.number.isRequired,
};
