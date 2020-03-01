import React from 'react'
// import PropTypes from 'prop-types';
import actions from '../../../redux/actions';
import { connect } from 'react-redux';
import { deepcopy } from '../../../utils';
import { BLANK_ORDER_DETAILS, BLANK_ITEMGROUP, BLANK_ITEM } from '../../../constants';
import produce from 'immer';

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

	constructor(props) {
		super(props);
		this.state = this.mapPropsToState(props);
	}

	mapPropsToState = (props) => (
		this.isCreator(props) ? ({
			'details': {
				...BLANK_ORDER_DETAILS,
				begin_at: Date.now(),
				end_at: Date.now()
			},
			'groups': [],
			'items': []
		}) : ({
				'details': deepcopy(BLANK_ORDER_DETAILS),
				'groups': [],
				'items': []
		})
	)

	isCreator = (props = this.props) => props.sale_id === null

	handleChange = event => {
		const value = event.currentTarget.value;
		const { key, maxsize } = event.currentTarget.dataset;

		// Value verification
		if (maxsize)
			value = value.slice(maxsize)

		// Update value in state
		const newState = produce(this.state, draft => {
			key.split('.').reduce((place, step, index, stepsArr) => {
				if (index === stepsArr.length - 1)
					place[step] = value;
				return place[step];
			}, draft);
			return draft;
		});
		console.log(this.state.details.name, newState.details.name)
		this.setState(newState, () => console.log(this.state.details.name));
	}

	saveDetails = details => {

	}

	addItem = () => this.setState(prevState => ({
		items: [ ... prevState.items, deepcopy(BLANK_ITEM) ]		
	}))

	upsertItem = () => {

	}

	render() {
		return (
			<div className="container">
				{this.isCreator() ? (
					<h1>Création d'une vente</h1>
				) : (
					<h1>Édition de la vente {this.props.sale.name}</h1>
				)}
				
				<h2>Détails</h2>
				<SaleDetailsEditor isCreator={this.isCreator()}
				                   details={this.state.details || {}}
				                   handleChange={this.handleChange}
				                   save={this.saveDetails}
				/>

				<h2>Articles</h2>
				<Button onClick={this.addItem}>Créer un article</Button>
				{this.props.items ? (
					Object.values(this.state.items).forEach(item => (
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
