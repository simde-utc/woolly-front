import React from 'react';
import { Switch } from 'react-router-dom';
import ProtectedRoute from '../../components/common/ProtectedRoute';

import Dashboard from './Dashboard';
import AssoSales from './AssoSales';
import SaleDetail from './SaleDetail';
import Error404 from '../Error404';

class Admin extends React.Component {
	render() {
		const base_url = this.props.match.url;
		return (
			<Switch>
				<ProtectedRoute path={base_url} exact component={Dashboard} />
				<ProtectedRoute path={`${base_url}/sales`} exact component={AssoSales} />
				<ProtectedRoute path={`${base_url}/sales/:sale_id`} exact component={SaleDetail} />
				
				<ProtectedRoute component={Error404} />
			</Switch>
		);
	}
}

export default Admin;
