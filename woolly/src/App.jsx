import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import Error404 from './pages/Error404';

const HEADER_HEIGHT = 64;

class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<div style={{ paddingTop: HEADER_HEIGHT }}>
					<Header height={HEADER_HEIGHT} />
					<Switch>
						<Route path="/" exact component={Home} />
						{/*
						<Route path="/ventes" exact component={Sales} />
						<Route path="/ventes/:sale_id" exact component={SaleDetail} />
						 */}
						<Route component={Error404} />

					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
