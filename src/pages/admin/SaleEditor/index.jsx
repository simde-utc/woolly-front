import React from 'react'
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../redux/actions';
import produce from 'immer';

import { REGEX_SLUG, BLANK_SALE_DETAILS, BLANK_ITEMGROUP, BLANK_ITEM } from '../../../constants';
import { deepcopy, isEmpty } from '../../../utils';

import { Button } from '@material-ui/core';
import DetailsEditor from './DetailsEditor';
import ItemEditor from './ItemEditor';
import Loader from '../../../components/common/Loader';


const connector = connect((store, props) => {
	const sale_id = props.match.params.sale_id || null;

	const assos = store.getAuthRelatedData('associations', {});
	const assosChoices = Object.values(assos).map(asso => ({
		value: asso.id,
		label: asso.shortname,
	}));

	const usertypes = store.get('usertypes');
	console.log(usertypes)
	const usertypesChoices = Object.values(usertypes.data).map(usertype => ({
		value: usertype.id,
		label: usertype.name,
	}));

	return {
		sale_id,
		assosChoices,
		usertypes,
		usertypesChoices,
		sale: sale_id ? store.getData(['sales', sale_id], null) : null,
		items: sale_id ? store.getData(['sales', sale_id, 'items'], {}) : {},
	};
})

class SaleEditor extends React.Component {

	constructor(props) {
		super(props);
		this.state = this.mapPropsToState(props);
		this.props.dispatch(actions.usertypes.all());
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
		const default_errors = { details: {}, items: {} };
		if (this.isCreator(props)) {
			// Create sale
			return {
				loading_details: false,
				details: {
					...deepcopy(BLANK_SALE_DETAILS),
					begin_at: new Date(),
					end_at: new Date(),
				},
				errors: default_errors,
			};
		} else if (props.location.state && props.location.state.data) {
			// Get data from freshly created sale
			const data = props.location.state.data;
			return {
				loading_details: false,
				name: data.name,
				details: deepcopy(data),
				itemgroups: [],
				items: {},
				errors: default_errors,
			};
		} else if (props.sale) {
			// Got sale data from store
			return {
				name: props.sale.name,
				details: deepcopy(props.sale),
				itemgroups: [],
				items: props.items,
				errors: default_errors,
				saving_details: false,
				loading_details: false,
				loading_items: false,
			};
		} else {
			const saleId = this.props.match.params.sale_id;
			this.props.dispatch(actions.sales.find(saleId));
			this.props.dispatch(actions.sales(saleId).items.all());
			// this.props.dispatch(actions.sales(saleId).itemgroups.all());
			return { loading_details: true, loading_items: true };
		}
	}

	// Handlers

	handleChange = event => {
		const valueKey = event.target.hasOwnProperty('checked') ? 'checked' : 'value';
		const { name, [valueKey]: value } = event.target;
		// const { maxsize } = event.currentTarget.dataset;

		// Value verification
		// if (name === 'details.id' && value.length && !REGEX_SLUG.test(value))
		// 	return;
		// if (maxsize)
		// 	value = value.slice(maxsize)

		// Update value in state
		this.setState(prevState => produce(prevState, draft => {
			name.split('.').reduce((place, step, index, stepsArr) => {
				if (index === stepsArr.length - 1)
					place[step] = value;
				return place[step];
			}, draft);
			return draft;
		}));
	}

	handleSaveDetails = async event => {
		const { details } = this.state;
		const isCreator = this.isCreator();

		// Check id value
		if (!REGEX_SLUG.test(details.id))
			return this.setState(prevState => produce(prevState, draft => {
				draft.errors.details.id = ["Invalide"];
				return draft;
			}));

		// Create or update details
		try {
			if (isCreator) {
				// TODO Create and store with id after await
				const response = await actions.sales.create(null, details).payload;
				const data = response.data;
				const saleId = data.id;
				return this.props.history.push(`/admin/sales/${saleId}/edit`, { data });				
			} else {
				this.props.dispatch(actions.sales.update(this.props.sale_id, null, details));
				return this.setState({ saving_details: true });
			}
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

	handleAddItem = event => {
		// Create a random id only for state purposes
		const id = "fake_" +Math.random().toString(36).slice(2);
		this.setState(prevState => ({
			items: {
				...prevState.items,
				[id]: { id, ...deepcopy(BLANK_ITEM) },
			}
		}))
	}

	handleAddItemGroup = event => this.setState(prevState => ({
		itemgroups: [ ...prevState.itemgroups, deepcopy(BLANK_ITEMGROUP) ]		
	}))

	handleSaveItem = event => {

	}

	// Rendering

	render() {
		const isCreator = this.isCreator();
		const title = isCreator ? (
			"Création d'une vente"
		) : (
			"Édition de la vente " + this.state.name || '...'
		);

		return (
			<div className="container">
				<h1>{title}</h1>
				
				<h2>Détails</h2>
				{this.state.loading_details ? (
					<Loader text="Chargement des détails de la vente..." />
				) : (
					<DetailsEditor
						details={this.state.details}
						errors={this.state.errors.details}
						assos={this.props.assosChoices}
						handleChange={this.handleChange}
						handleSave={this.handleSaveDetails}
						saving={this.state.saving_details}
						isCreator={isCreator}
					/>
				)}

				{!isCreator && (
					<React.Fragment>
						<h2>Articles</h2>
						{this.state.loading_items ? (
							<Loader text="Chargement des articles..." />
						) : (
							!isEmpty(this.state.items) ? (
								Object.values(this.state.items).map((item, index) => (
									<ItemEditor
										key={item.id}
										item={item}
										errors={this.state.errors.items[item.id] || {}}
										handleChange={this.handleChange}
										handleSave={this.handleSaveItem}
										usertypes={this.props.usertypesChoices}
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
