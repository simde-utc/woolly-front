import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { hasManagerRights } from '../../utils';


const authFunctions = {
	logged(auth, userAssos, props) {
		return auth.authenticated;
	},
	admin(auth, userAssos, props) {
		return auth.authenticated && auth.is_admin;
	},
	manager(auth, userAssos, props) {
		return hasManagerRights(auth, userAssos);
	},
	asso_manager(auth, userAssos, props) {
		const asso_id = this.props.computedMatch.params.asso_id;
		return hasManagerRights(auth, userAssos, props) && (asso_id in userAssos || auth.is_admin);
	},
};

export default function ProtectedRoute({ only, authOptions, redirection, component: Component, ...routeProps }) {
	const auth = useSelector(store => store.getData('auth'));
	const userAssos = useSelector(store => store.getAuthRelatedData('associations'));

	const isAuthorized = (
		typeof only == 'function'
			? only(auth, userAssos, routeProps)
			: (auth && authFunctions[only](auth, userAssos, routeProps))
	);
	return (
		<Route
			{...routeProps} 
			render={props => (
				isAuthorized ? <Component {...props} />
				             : <Redirect to={redirection} />
			)}
		/>
	);
}

ProtectedRoute.propTypes = {
	redirection: PropTypes.string,
	only: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
};

ProtectedRoute.defaultProps = {
	redirection: '/login',
	only: 'logged',
};
