import React from 'react'
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../redux/actions';

import Loader from '../../components/common/Loader';
import { Link, NavButton } from '../../components/common/Nav';

// import { withStyles } from '@material-ui/core/styles';
// import { Button, Paper, FormControlLabel, Checkbox } from '@material-ui/core';
// import { ShoppingCart, Delete } from '@material-ui/icons';

const connector = connect((store, props) => {
	const asso_id = props.match.params.asso_id;
	return {
		asso_id,
		asso: store.getData(['associations', asso_id], null),
		sales: store.getData(['associations', asso_id, 'sales'], null, false),
	};
})

class AssoDashboard extends React.Component {

	componentDidMount() {
		const { asso_id } = this.props;
		if (!this.props.asso)
			this.props.dispatch(actions.associations.find(asso_id));
		if (!this.props.sales)
			this.props.dispatch(actions.associations(asso_id).sales.get());
	}

	render() {
		const { asso, sales } = this.props;
		if (asso === null)
			return <Loader />

		return (
			<div className="container">
				<h1>Dashboard de l'asso {asso.shortname}</h1>
				<h2>Informations</h2>
				<p>TODO</p>

				<h2>Ventes</h2>
				{sales === null ? (
					<Loader text="Chargement des ventes..." />
				) : (
					Object.values(sales).length === 0 ? (
						<div>Aucune vente n'a été créée</div>
					) : (
						<ul>
							{Object.values(sales).map(sale => (
								<li key={sale.id}>
									<Link to={`/admin/sales/${sale.id}/edit`}>{sale.name}</Link>
								</li>
							))}
						</ul>
					)
				)}
				<NavButton to="/admin/sales/create">Créer une vente</NavButton>
			</div>
		);
	}
}


export default connector(AssoDashboard);