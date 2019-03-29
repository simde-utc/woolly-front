import React from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions';

import Loader from '../components/Loader';
import SalesList from '../components/common/SalesList';
import SaleCard from '../components/common/SaleCard';

const decorator = connect(store => ({
	sales: store.getData('sales'),
	pagination: store.getPagination('sales'),
	fetching: store.isFetching('sales'),
	fetched: store.isFetched('sales'),
}))
class Home extends React.Component {
	componentDidMount() {
		this.props.dispatch(actions.sales.all({ include: 'association' }))
	}

	render() {
		const { sales, fetched, fetching } = this.props;
		return (
			<div className="container">
				<h2>Ventes en cours</h2>

				<Loader loading={!fetched || fetching} text="Récupération des ventes en cours...">
					{/* <SalesList sales={this.props.sales} /> */}
					<div style={{ display: 'flex' }}>
						{this.props.sales.map(sale => (
							<SaleCard key={sale.id} sale={sale} />
						))}
					</div>
				</Loader>
			</div>
		);
	}
}

export default decorator(Home);
