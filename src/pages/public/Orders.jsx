import React from 'react'
import { connect } from 'react-redux';
import actions from '../../redux/actions';
import { withStyles } from '@material-ui/core/styles';

import Loader from '../../components/common/Loader';
import OrdersList from '../../components/orders/OrdersList';

const ORDERS_PATH = ['auth', 'orders'];
const connector = connect(store => ({
	user: store.getData('auth', {}).user,
	orders: store.get(ORDERS_PATH),
}))

class Orders extends React.Component {
	componentDidMount() {
		if (!this.props.orders.fetched)
			this.fetchOrders();
	}

	componentDidUpdate(prevProps) {
		if (this.props.user && this.props.user !== prevProps.user)
			this.fetchOrders();
	}

	fetchOrders = () => {
		this.props.dispatch(actions(`users/${this.props.user.id}/orders`)
							.definePath(ORDERS_PATH)
							.all({ include: 'sale,orderlines,orderlines__item,orderlines__orderlineitems' }));
	}

	render() {
		const { classes } = this.props;
		return (
			<div className="container">
				<h1>Mes commandes</h1>

				<Loader fluid loading={this.props.orders.fetching} text="Récupération des commandes en cours...">
					<div className={classes.container}>
						<OrdersList
							orders={Object.values(this.props.orders.data)}
							updateOrders={this.fetchOrders}
						/>
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

export default connector(withStyles(styles)(Orders));