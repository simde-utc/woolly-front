import React from 'react'
import { connect } from 'react-redux';
import actions from '../../redux/actions';

import Loader from '../../components/common/Loader';
import AssoCard from '../../components/sales/AssoCard';

// const decorator = connect(store => ({
// 	sales: store.getData('sales'),
// 	pagination: store.getPagination('sales'),
// 	fetching: store.isFetching('sales'),
// 	fetched: store.isFetched('sales'),
// }))

const CURRENT_ASSO_DATA = [
	{   
		id : "DDFP.L DF9798H3",
		name: "Service Informatique de la maison des étudiants",
		login: "simde",
		description: "Les gens bizarres.",
		image: "https://assos.utc.fr/images/assos/6e105220-3af5-11e9-95ce-1f406c6cfae9/1551316140.png",
	},
	{
		id: "AH",
		name: "Intégration",
		login: "integ",
		description: "L'integ, c'est l'association qui s'occupe de l'accueil et de l'intégration des nouveaux étudiants de l'UTC.",
		image: "https://assos.utc.fr/images/assos/70aa91a0-3af5-11e9-a1f8-51095214d13c/1551316144.png",
	}
]

class AdminDashboard extends React.Component {
	componentDidMount() {
		// this.props.dispatch(actions.sales.all({ include: 'association' }))
	}

	render() {
		const associations = CURRENT_ASSO_DATA
		// const { sales, fetched, fetching } = this.props;
		return (
			<div className="container" style={{marginTop: "60px"}}>
				<h2 style={titleStyle}>Mes associations</h2>
				{/* <p>{associations}</p> */}
				{/* <Loader loading={!fetched || fetching} text=" Récupération des ventes en cours..."> */}
					<div style={{ display: 'flex' }}>
						{associations.map(asso => (
							<AssoCard key={asso.id} asso={asso} />
						))}
					</div>
				{/* </Loader> */}
			</div>
		);
	}
}

const titleStyle = {
	fontFamily: "roboto, sans-serif",
	fontWeight: "lighter",
	fontSize: "2em",
}

export default AdminDashboard;
