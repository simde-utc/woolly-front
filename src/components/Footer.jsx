import React from 'react'
import PropTypes from 'prop-types';
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

export default function Footer({ height }) {
	const classes = useStyles();
	const simdeLink = <Link href="https://assos.utc.fr/assos/simde" target="_blank" rel="noopener">SiMDE</Link>;
	const contactLink = <Link href="mailto:simde@assos.utc.fr">Contact</Link>;
	return (
		<span className={classes.container} style={{ height }}>
			Fait avec ♥ par le&nbsp;{simdeLink}.&nbsp;{contactLink}
		</span>
	);
}

Footer.propTypes = {
	height: PropTypes.number.isRequired,
};
