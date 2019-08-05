import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const connector = connect(store => ({
	auth: store.getData('auth', null),
}))
class ProtectedRoute extends React.Component {

	isAuthorized = (only, auth) => {
		if (typeof only == 'function')
			return only(auth);

		if (auth === null)
			return false;
		switch (only) {
			case 'admin':
			case 'manager':
			case 'logged':
				return auth.authenticated;
			default:
				throw Error(`Type ${only} is not implemented.`);
		}
	}

	render() {
		const { auth, only, redirection, component: Component, ...routeProps } = this.props;
		return (
			<Route
				{...routeProps} 
				render={props => (this.isAuthorized(only, auth)
					? <Component {...props} />
					: <Redirect to={redirection} />
				)}
			/>
		);
	}
}

ProtectedRoute.propTypes = {
	auth: PropTypes.object.isRequired,
	only: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	redirection: PropTypes.string,
}

ProtectedRoute.defaultProps = {
	only: 'logged',
	redirection: '/login',
}

export default connector(ProtectedRoute);