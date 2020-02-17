import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { hasManagerRights } from '../../utils';

const connector = connect(store => ({
	auth: store.getData('auth', {}),
	userAssos: store.getAuthRelatedData('associations'),
}))
class ProtectedRoute extends React.Component {

	isAuthorized = only => {
		const { auth, userAssos } = this.props;
		if (typeof only == 'function')
			return only(auth, userAssos);

		if (auth === null)
			return false;
		switch (only) {
			case 'admin':
				return auth.authenticated && auth.is_admin;
			case 'manager':
				return hasManagerRights(auth, userAssos)
			case 'asso_manager':
				console.log(this.props)
				return hasManagerRights(auth, userAssos);
				const asso_id = this.props.computedMatch.params.asso_id;

			case 'logged':
				return auth.authenticated;
			default:
				throw Error(`Authorization type '${only}' is not implemented.`);
		}
	}

	render() {
		const { auth, only, authOptions, redirection, component: Component, ...routeProps } = this.props;
		return (
			<Route
				{...routeProps} 
				render={props => (this.isAuthorized(only)
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