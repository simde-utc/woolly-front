import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import actions from './redux/actions';
import CssBaseline from '@material-ui/core/CssBaseline';

// Layout components
import Header from './components/Header';
import Footer from './components/Footer';
import MainLoader from './components/MainLoader';
import Loader from './components/common/Loader';
import ProtectedRoute from './components/common/ProtectedRoute';

// Main pages
import Home from './pages/Home';
import Error404 from './pages/Error404';
import Account from './pages/Account';
import LoginLogout from './pages/LoginLogout';

// Public pages
import Sales from './pages/public/Sales';
import SaleDetail from './pages/public/SaleDetail';
import Orders from './pages/public/Orders';
import OrderDetail from './pages/public/OrderDetail';

// Lazy loaded pages
const Admin = React.lazy(() => import('./pages/admin/'));

// TODO Set in theme
const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 40;

class App extends React.Component {
	componentDidMount() {
		// Get connected user
		store.dispatch(actions.auth().all());
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
							<React.Suspense fallback={<Loader text="Chargement en cours" size="lg" />}>
								<Switch>
									<Route path="/" exact component={Home} />
									<ProtectedRoute path="/admin" component={Admin} />

									<Route path="/sales" exact component={Sales} />
									<Route path="/sales/:sale_id" exact component={SaleDetail} />

									<ProtectedRoute path="/account" exact component={Account} />
									<ProtectedRoute path="/orders" exact component={Orders} />
									<ProtectedRoute path="/orders/:order_id" exact component={OrderDetail} />

									<Route path="/login" exact render={props => <LoginLogout {...props} action="login" />} />
									<Route path="/logout" exact render={props => <LoginLogout {...props} action="logout" />} />

									<Route component={Error404} />
								</Switch>
							</React.Suspense>
							<Footer height={FOOTER_HEIGHT} />
						</div>
					</BrowserRouter>
				</MainLoader>
			</Provider>
		);
	}
}

export default App;
