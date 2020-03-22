import React from 'react'
// import PropTypes from 'prop-types';
// import actions from '../../../redux/actions';
import { connect } from 'react-redux';
import produce from 'immer';

import { apiAxios } from '../../../redux/actions';
import { deepcopy } from '../../../utils';
import { BLANK_ORDER_DETAILS, BLANK_ITEMGROUP, BLANK_ITEM } from '../../../constants';

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
				...deepcopy(BLANK_ORDER_DETAILS),
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
		const valueKey = event.target.hasOwnProperty('checked') ? 'checked' : 'value';
		const { name, [valueKey]: value } = event.target;
		// const { maxsize } = event.currentTarget.dataset;

		// Value verification
		// if (maxsize)
		// 	value = value.slice(maxsize)

		// Update value in state
		const newState = produce(this.state, draft => {
			name.split('.').reduce((place, step, index, stepsArr) => {
				if (index === stepsArr.length - 1)
					place[step] = value;
				return place[step];
			}, draft);
			return draft;
		});
		this.setState(newState);
	}

	saveDetails = async () => {
		const { details } = this.state;
		const isCreator = this.isCreator();
		const resp = await apiAxios.request({
			method: isCreator ? 'post' : 'update',
			url: isCreator ? 'sales' : `sales/${this.props.sale_id}`,
			data: details,
			withCredentials: true,
		})

		console.log(resp)
	}

	addItem = () => this.setState(prevState => ({
		items: [ ...prevState.items, deepcopy(BLANK_ITEM) ]		
	}))

	addGroup = () => this.setState(prevState => ({
		groups: [ ...prevState.groups, deepcopy(BLANK_ITEMGROUP) ]		
	}))

	upsertItem = (id) => {

	}

	render() {
		const isCreator = this.isCreator();
		const assosChoices = Object.values(this.props.userAssos).map(asso => ({
			value: asso.id,
			label: asso.shortname,
		}))
		return (
			<div className="container">
				{isCreator ? (
					<h1>Création d'une vente</h1>
				) : (
					<h1>Édition de la vente {this.props.sale.name}</h1>
				)}
				
				<h2>Détails</h2>
				<SaleDetailsEditor details={this.state.details}
								   assos={assosChoices}
				                   handleChange={this.handleChange}
				                   handleSave={this.saveDetails}
				                   isCreator={isCreator}
				/>

				<h2>Articles</h2>
				<Button onClick={this.addItem}>Créer un article</Button>
				{this.state.items.length ? (
					this.state.items.map((item, index) => (
						<ItemEditor key={item.id || `new-${index}`}
				                item={item}
				                handleChange={this.handleChange}
				                handleSave={this.upsertItem}
				                isCreator={isCreator}
						/>
					))
				) : (
					<div>Aucun article</div>
				)}
			</div>
		);
	}

}

export default connector(SaleEditor);
