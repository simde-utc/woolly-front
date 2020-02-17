import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Loader from './common/Loader';


import actions, { RestAction } from '../redux/actions'
window.actions = actions // DEBUG
window.RestAction = RestAction // DEBUG


const decorator = connect(store => ({
	auth: store.get('auth', {}),
}));

class MainLoader extends React.Component {
	render() {
		const { classes, auth } = this.props
		if (auth.fetched && auth.data && Object.entries(auth.data).length)
			return this.props.children;

		return (
			<div className={classes.container}>
				<h1>Woolly</h1>
				<Loader fluid={false} />
			</div>
		);
	}
}

MainLoader.propTypes = {
	classes: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
}

const styles = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
		width: '100vw',
	},
}

export default decorator(withStyles(styles)(MainLoader));
