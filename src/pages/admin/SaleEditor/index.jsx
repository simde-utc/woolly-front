import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../redux/actions';
import { isEmpty } from '../../../utils';

import { Button } from '@material-ui/core';
import SaleDetailsEditor from './SaleDetailsEditor';
import ItemEditor from './ItemEditor';

const connector = connect((store, props) => {
	const sale_id = props.match.params.sale_id || null;
	return {
		sale_id,
		userAssos: store.getAuthRelatedData('associations', {}),
		sale: sale_id ? store.getData(['sales', sale_id], null) : null,
		items: sale_id ? store.getData(['sales', sale_id, 'items'], null) : null,
	};
})

class SaleEditor extends React.Component {

	isCreator = () => this.props.sale_id === null

	handleChange = event => {
		const value = event.currentTarget.value;
		const { key, maxsize} = event.currentTarget.dataset;
		console.log(key, value, maxsize);

	}

	saveDetails = details => {

	}

	addItem = () => {

	}

	upsertItem = () => {

	}

	render() {
		return (
			<div className="container">
				<h1>
					{this.isCreator() ? "Création d'une vente" : `Édition de la vente ${this.props.sale.name}`}
				</h1>
				<h2>Détails</h2>
				<SaleDetailsEditor isCreator={this.isCreator()}
				                   sale={this.props.sale}
				                   save={this.saveDetails}
				/>

				<h2>Articles</h2>
				<Button onClick={this.addItem}>Créer un article</Button>
				{this.props.items ? (
					Object.values(this.props.items).forEach(item => (
						<ItemEditor item={item} />
					))
				) : (
					<div>Aucun article</div>
				)}
			</div>
		);
	}

}

export default connector(SaleEditor);
