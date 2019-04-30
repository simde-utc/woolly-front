import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import Header from './components/Header';

import Home from './pages/Home';
import Error404 from './pages/Error404';
import Sales from './pages/Sales';
import SaleDetail from './pages/SaleDetail';
import Login from './pages/Login';

import AdminDashoard from './pages/administration/AdminDashboard';
import AdminAssoSales from './pages/administration/AdminAssoSales';
import AdminSaleDetail from './pages/administration/AdminSaleDetails';

const HEADER_HEIGHT = 64;

class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<div style={{ paddingTop: HEADER_HEIGHT }}>
						<Header height={HEADER_HEIGHT} />
						<Switch>
							<Route path="/" exact component={Home} />
							<Route path="/ventes" exact component={Sales} />
							<Route path="/ventes/:sale_id" exact component={SaleDetail} />
							<Route path="/login" exact component={Login} />
							<Route path="/admin" exact component={AdminDashoard} />
							<Route path="/admin/:asso_id" exact component={AdminAssoSales} />
							<Route path="/admin/:asso_id/ventes/:sale_id" exact component={AdminSaleDetail} />
							<Route component={Error404} />

						</Switch>
					</div>
				</BrowserRouter>
			</Provider>
		);
	}
}

export default App;
