import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import actions from './redux/actions';
import CssBaseline from '@material-ui/core/CssBaseline';

import Header from './components/Header';
import Footer from './components/Footer';
import MainLoader from './components/MainLoader';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Error404 from './pages/Error404';
import Account from './pages/Account';
import LoginLogout from './pages/LoginLogout';

import Sales from './pages/Sales';
import SaleDetail from './pages/SaleDetail';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';

// TODO Set in theme
const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 40;

class App extends React.Component {
	componentDidMount() {
		// Get connected user
		store.dispatch(actions('/auth/me').definePath(['auth']).all({ include: 'usertype' }));
	}

	render() {
		return (
			<Provider store={store}>
				<CssBaseline />
				<MainLoader>
					<BrowserRouter>
						<div style={{
							paddingTop: HEADER_HEIGHT, paddingBottom: FOOTER_HEIGHT,
							height: '100%', boxSizing: 'border-box', overflowY: 'auto',
						}}>
							<Header height={HEADER_HEIGHT} />
							<Switch>
								<Route path="/" exact component={Home} />
								<Route path="/sales" exact component={Sales} />
								<Route path="/sales/:sale_id" exact component={SaleDetail} />

								<ProtectedRoute path="/account" exact component={Account} />
								<ProtectedRoute path="/orders" exact component={Orders} />
								<ProtectedRoute path="/orders/:order_id" exact component={OrderDetail} />

								<Route path="/login" exact render={props => <LoginLogout {...props} action="login" />} />
								<Route path="/logout" exact render={props => <LoginLogout {...props} action="logout" />} />
								<Route component={Error404} />
							</Switch>
							<Footer height={FOOTER_HEIGHT} />
						</div>
					</BrowserRouter>
				</MainLoader>
			</Provider>
		);
	}
}

export default App;
