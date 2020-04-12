import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import { connect } from 'react-redux';
import { hasManagerRights } from '../../utils';

import Loader from '../../components/common/Loader';
import Dashboard from './Dashboard';
import AssoDashboard from './AssoDashboard';
import AssoSales from './AssoSales';
import SaleDetail from './SaleDetail';
import SaleEditor from './SaleEditor/';
import Error404 from '../Error404';


const decorator = connect(store => ({
	auth: store.getData('auth', {}),
	userAssos: store.getAuthRelatedData('associations', null),
}));

class AdminSite extends React.Component {

	render() {
		const { auth, userAssos } = this.props;

		// Wait for user's associations to be fetched
		if (userAssos === null)
			return <Loader />

		// Redirect if user has no manager rights
		if (!hasManagerRights(auth, userAssos))
			return <Redirect to="/" />

		const base_url = this.props.match.url;
		return (
			<Switch>
				<Route path={base_url} exact component={Dashboard} />
				<ProtectedRoute path={`${base_url}/assos/:asso_id`} only="asso_manager" exact component={AssoDashboard} />

				<Route path={`${base_url}/sales/create`} exact component={SaleEditor} />
				<Route path={`${base_url}/sales/:sale_id/edit`} exact component={SaleEditor} />
				
				<Route path={`${base_url}/sales`} exact component={AssoSales} />
				<Route path={`${base_url}/sales/:sale_id`} exact component={SaleDetail} />
				
				<Route component={Error404} />
			</Switch>
		);
	}
}

export default decorator(AdminSite);
