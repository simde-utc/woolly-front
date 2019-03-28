import React from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions';

import { List, ListItem, ListItemText } from '@material-ui/core';
import Loader from '../components/Loader';

const decorator = connect(store => ({
	sales: store.getData('sales'),
	fetching: store.isFetching('sales'),
	fetched: store.isFetched('sales'),
}))

class Home extends React.Component {
	componentDidMount() {
		this.props.dispatch(actions.sales.all())
	}

	render() {
		const { sales, fetched, fetching } = this.props;
		window.p = this.props
		return (
			<div className="container">
				<h2>Liste des ventes</h2>

				<Loader loading={!fetched || fetching} text="Récupération des ventes en cours...">
					<List>
						{sales.count > 0 ? sales.results.map(sale => (
							<ListItem key={sale.id}>
								{/* <ListItemIcon><FolderIcon /></ListItemIcon> */}
								<ListItemText
									primary={sale.name}
									// secondary={sale.association.name}
								/>
							</ListItem>
						)) : (
							<div>No sales</div>
						)}
					</List>
				</Loader>
			</div>
		);
	}
}

export default decorator(Home);
