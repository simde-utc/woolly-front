import React from 'react'
import { connect } from 'react-redux';
import actions from '../../redux/actions';
import { withStyles } from '@material-ui/core/styles';

import Loader from '../../components/common/Loader';
import SaleCard from '../../components/sales/SaleCard';

const connector = connect(store => ({
	sales: store.get('sales'),
}))

class Sales extends React.Component {
	componentDidMount() {
		if (!this.props.fetched || this.props.sales.data.length === 1)
			this.props.dispatch(actions.sales.all({ include: 'association' }));
	}

	render() {
		const { classes } = this.props;
		return (
			<div className="container">
				<h1>Liste des ventes</h1>

				<Loader fluid loading={this.props.sales.fetching} text="Récupération des ventes en cours...">
					<div className={classes.container}>
						{Object.values(this.props.sales.data || {}).map(sale => <SaleCard key={sale.id} sale={sale} /> )}
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