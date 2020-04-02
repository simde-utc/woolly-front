import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import actions from './redux/actions';

// Style
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { WoollyTheme } from './themes';

// Layout components
import Header from './components/Header';
import Footer from './components/Footer';
import MainLoader from './components/MainLoader';
import Loader from './components/common/Loader';
import ProtectedRoute from './components/common/ProtectedRoute';

// Main pages
import PublicSite from './pages/public/';
import LoginLogout from './pages/LoginLogout';
import Account from './pages/Account';
import Error404 from './pages/Error404';

// Public pages
import Sales from './pages/public/Sales';
import SaleDetail from './pages/public/SaleDetail';
import Orders from './pages/public/Orders';
import OrderDetail from './pages/public/OrderDetail';

// Lazy loaded pages
const AdminSite = React.lazy(() => import('./pages/admin/'));

// TODO Set in theme
const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 40;


function Wrappers(props) {
	return (
		<Provider store={store}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<CssBaseline />
				<ThemeProvider theme={WoollyTheme}>
					<MainLoader>
						<BrowserRouter>
							{props.children}	
						</BrowserRouter>
					</MainLoader>
				</ThemeProvider>
			</MuiPickersUtilsProvider>
		</Provider>
	);
}


class App extends React.Component {

	componentDidMount() {
		// Get connected user
		store.dispatch(actions.auth().all());
	}

	render() {
		return (
			<Wrappers>
				<div style={{
					paddingTop: HEADER_HEIGHT, paddingBottom: FOOTER_HEIGHT,
					height: '100%', boxSizing: 'border-box', overflowY: 'auto',
				}}>
					<Header height={HEADER_HEIGHT} />
					<React.Suspense fallback={<Loader text="Chargement en cours" size="lg" />}>
						<Switch>
							<ProtectedRoute path="/admin" component={AdminSite} />
							<Route path="/" exact component={PublicSite} />

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
			</Wrappers>
		);
	}
}

export default App;
