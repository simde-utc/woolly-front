import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Link } from '@material-ui/core';

class Footer extends React.Component{
	render() {
		const { classes, height } = this.props;
		return (
			<Paper square elevation={4} className={classes.container} style={{ height }}>
				<span>
					Fait avec ♥ par le <Link href="https://assos.utc.fr/assos/simde" target="_blank" rel="noopener">SiMDE</Link>
					 . <Link href="mailto:simde@assos.utc.fr">Contact</Link>
				</span>
			</Paper>
		);
	}
}

Footer.propTypes = {
	classes: PropTypes.object.isRequired,
	height: PropTypes.number.isRequired,
};

const styles = {
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
};

export default withStyles(styles)(Footer);
