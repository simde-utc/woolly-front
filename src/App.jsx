import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import actions from './redux/actions';
import { Box } from '@material-ui/core';

// Style
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { WoollyTheme } from './themes';

// Layout components
import MessageSystem from './components/MessageSystem';
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

function Wrappers(props) {
	return (
		<Provider store={store}>
			<CssBaseline />
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<ThemeProvider theme={WoollyTheme}>
					<MainLoader>
						<BrowserRouter basename={process.env.PUBLIC_URL}>
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
				<Box
					display="flex"
					flexDirection="column"
					height="100vh"
					boxSizing="border-box"
					style={{ overflowY: 'hidden' }}
				>
					<Header />
					<Box flex={1} position="relative" style={{ overflowY: 'auto' }}>
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
					</Box>
					<Footer />
					<MessageSystem />
				</Box>
			</Wrappers>
		);
	}
}

export default App;
