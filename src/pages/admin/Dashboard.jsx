import React from 'react'
import { connect } from 'react-redux';
import actions from '../../redux/actions';

import Loader from '../../components/common/Loader';
import AssoCard from '../../components/sales/AssoCard';

const connnector = connect(store => {
	const authId = store.getAuthUser('id');
	return {
		authId,
		assos: authId ? store.getAuthRelatedData('associations', {}) : {},
		sales: store.getData('sales'),
		fetching: store.isFetching('sales'),
		fetched: store.isFetched('sales'),
		// pagination: store.getPagination('sales'),
	};
})

class AdminDashboard extends React.Component {
	componentDidMount() {
		if (this.props.authId)
			this.props.dispatch(actions.auth(this.props.authId).associations.all());
	}

	componentDidUpdate(prevProps) {
		if (this.props.authId && this.props.authId !== prevProps.authId)
			this.props.dispatch(actions.auth(this.props.authId).associations.all());
	}

	render() {
		const { assos } = this.props;
		window.p = this.props;

		// const { sales, fetched, fetching } = this.props;
		return (
			<div className="container">
				<h1>Admin Dashboard</h1>

				<h2>Mes associations</h2>
				{/* <p>{associations}</p> */}
				{/* <Loader loading={!fetched || fetching} text=" Récupération des ventes en cours..."> */}
					<div style={{ display: 'flex' }}>
						{Object.values(assos).map(asso => (
							<AssoCard key={asso.id} asso={asso} />
						))}
					</div>
				{/* </Loader> */}
			</div>
		);
	}
}

export default connnector(AdminDashboard);
