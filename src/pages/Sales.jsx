import React from 'react'
import { connect } from 'react-redux';
import actions from '../redux/actions';
import { withStyles } from '@material-ui/core/styles';

import Loader from '../components/common/Loader';
import SaleCard from '../components/sales/SaleCard';

const connector = connect(store => ({
	sales: store.getData('sales', []),
	fetching: store.isFetching('sales'),
	fetched: store.isFetched('sales'),
	// pagination: store.getPagination('sales'),
}))

class Sales extends React.Component {
	componentDidMount() {
		if (!this.props.fetched || this.props.sales.length === 1)
			this.props.dispatch(actions.sales.all({ include: 'association' }));
	}

	render() {
		const { classes } = this.props;
		return (
			<div className="container">
				<h1>Liste des ventes</h1>

				<Loader fluid loading={this.props.fetching} text=" Récupération des ventes en cours...">
					<div className={classes.container}>
						{this.props.sales.map(sale => <SaleCard key={sale.id} sale={sale} /> )}
					</div>
				</Loader>
			</div>
		);
	}
}

const styles = {
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		// overflowX: 'auto',
	}
};

export default connector(withStyles(styles)(Sales));