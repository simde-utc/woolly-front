import React from 'react'
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../redux/actions';
import produce from 'immer';

import { apiAxios } from '../../../redux/actions';
import { deepcopy } from '../../../utils';
import { BLANK_ORDER_DETAILS, BLANK_ITEMGROUP, BLANK_ITEM } from '../../../constants';

import { Button } from '@material-ui/core';
import DetailsEditor from './DetailsEditor';
import ItemEditor from './ItemEditor';
import Loader from '../../../components/common/Loader';


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
		window.props = this.props; // DEBUG
	}

	// Props and state management

	componentDidUpdate(prevProps) {
		if (prevProps.sale !== this.props.sale ||
			prevProps.match.params.sale_id !== this.props.match.params.sale_id
		) {
			this.setState(this.mapPropsToState(this.props));
		}
	}

	isCreator = (props = this.props) => (!props.match.params.sale_id)

	mapPropsToState(props) {
		if (this.isCreator(props)) {
			// Create sale
			return {
				loading_details: false,
				details: {
					...deepcopy(BLANK_ORDER_DETAILS),
					begin_at: new Date(),
					end_at: new Date(),
				},
				errors: {},
			};
		} else if (props.location.state && props.location.state.data) {
			// Get data from freshly created sale
			const data = props.location.state.data;
			return {
				loading_details: false,
				name: data.name,
				details: deepcopy(data),
				groups: [],
				items: [],
				errors: {},
			};
		} else if (props.sale) {
			// Got sale data from store
			const { items, ...sale } = props.sale;
			return {
				name: sale.name,
				details: deepcopy(sale),
				groups: [],
				items,
				errors: {},
				loading_details: false,
				loading_items: false,
			};
		} else {
			// Fetch sale data with redux action
			const saleId = props.match.params.sale_id;
			this.props.dispatch(actions.sales.find(saleId, {
				include: 'items' // TODO itemgroups
			}));

			return { loading_details: true, loading_items: true };
		}
	}

	// Handlers

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

	handleSaveDetails = async event => {
		const { details } = this.state;
		const isCreator = this.isCreator();

		try {
			const response = await apiAxios.request({
				method: isCreator ? 'post' : 'update',
				url: isCreator ? 'sales' : `sales/${this.props.sale_id}`,
				data: details,
				withCredentials: true,
			})
			const data = response.data;
			const saleId = data.id;
			return this.props.history.push(`/admin/sales/${saleId}/edit`, { data });
		} catch(error) {
			console.log(error) // DEBUG
			this.setState(prevState => ({
				errors: {
					...prevState.errors,
					details: error.response.data,
				},
			}));
		}
	}

	handleAddItem = event => this.setState(prevState => ({
		items: [ ...prevState.items, deepcopy(BLANK_ITEM) ]		
	}))

	handleAddGroup = event => this.setState(prevState => ({
		groups: [ ...prevState.groups, deepcopy(BLANK_ITEMGROUP) ]		
	}))

	handleSaveItem = event => {

	}

	// Rendering

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
					<h1>Édition de la vente {this.state.name || '...'}</h1>
				)}
				
				<h2>Détails</h2>
				{this.state.loading_details ? (
					<Loader text="Chargement des détails de la vente..." />
				) : (
					<DetailsEditor details={this.state.details}
					               errors={this.state.errors.details || {}}
					               assos={assosChoices}
					               handleChange={this.handleChange}
					               handleSave={this.handleSaveDetails}
					               isCreator={isCreator}
					/>
				)}

				{!isCreator && (
					<React.Fragment>
						<h2>Articles</h2>
						{this.state.loading_items ? (
							<Loader text="Chargement des articles..." />
						) : (
							this.state.items.length ? (
								this.state.items.map((item, index) => (
									<ItemEditor key={item.id || `new-${index}`}
									            item={item}
									            handleChange={this.handleChange}
									            handleSave={this.handleSaveItem}
									            isCreator={isCreator}
									/>
								))
							) : (
								<div>Aucun article</div>
							)
						)}
						<Button onClick={this.handleAddItem}>Créer un article</Button>
					</React.Fragment>
				)}
			</div>
		);
	}

}

export default connector(SaleEditor);
