import React from 'react'
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../redux/actions';
import produce from 'immer';

import { REGEX_SLUG, BLANK_SALE_DETAILS, BLANK_ITEMGROUP, BLANK_ITEM } from '../../../constants';
import { isEmpty, areDifferent } from '../../../utils';

import { Button } from '@material-ui/core';
import DetailsEditor from './DetailsEditor';
import ItemEditor from './ItemEditor';
import Loader from '../../../components/common/Loader';


const connector = connect((store, props) => {
	const saleId = props.match.params.sale_id || null;

	const assos = store.getAuthRelatedData('associations', {});
	const assosChoices = Object.values(assos).map(asso => ({
		value: asso.id,
		label: asso.shortname,
	}));

	const usertypes = store.get('usertypes');
	const usertypesChoices = Object.values(usertypes.data).map(usertype => ({
		value: usertype.id,
		label: usertype.name,
	}));

	return {
		saleId,
		assosChoices,
		usertypes,
		usertypesChoices,
		sale: saleId ? store.getData(['sales', saleId], null) : null,
		items: saleId ? store.getData(['sales', saleId, 'items'], {}) : {},
		// itemgroups: saleId ? store.getData(['sales', saleId, 'itemgroups'], {}) : {},
		fields: store.getData(['fields'], {}),
	};
})

class SaleEditor extends React.Component {

	constructor(props) {
		super(props);
		this.state = this.getStateFor('create');
		window.props = this.props;  // DEBUG
	}

	// Props and state management

	componentDidMount() {
		if (!this.isCreator())
			this.fetchData();

		// Fetch side resources
		if (isEmpty(this.props.usertypes))
			this.props.dispatch(actions.usertypes.all());
		if (isEmpty(this.props.fields))
			this.props.dispatch(actions.fields.all());
	}

	componentDidUpdate(prevProps) {
		const differentSale = areDifferent(prevProps, this.props, 'saleId');

		// Going to create mode
		if (differentSale) {
			if (this.isCreator())
				this.setState(this.getStateFor('create'));
			else
				this.fetchData();
		}
		// Get or update details/items/itemgroups
		else {
			for (const resource of ['sale', 'items', 'itemgroups'])
				if (areDifferent(prevProps, this.props, resource))
					this.setState(prevState => this.getStateFor(resource, differentSale && prevState));
		}
	}

	isCreator = () => (!this.props.saleId)

	fetchData() {
		this.setState({
			loading_details: true,
			loading_items: true,
			loading_itemgroups: true,
		});
		const saleId = this.props.saleId;
		this.props.dispatch(actions.sales.find(saleId));
		this.props.dispatch(actions.sales(saleId).items.all());
		this.props.dispatch(actions.sales(saleId).itemgroups.all());
	}

	getStateFor(resource, prevState = null) {
		switch (resource) {
			case 'create':
				return {
					details: {
						...BLANK_SALE_DETAILS,
						begin_at: new Date(),
						end_at: new Date(),
					},
					items: {},
					itemgroups: {},

					errors: {
						details: {},
						items: {},
						itemgroups: {},
					},
					loading_details: false,
					loading_items: false,
					loading_item: {},
					loading_itemgroups: false,
					loading_itemgroup: {},
				};
			case 'sale':
				if (this.props.sale === null)
					return { loading_details: true };
				else
					return {
						name: this.props.sale.name,
						details: this.props.sale,
						loading_details: false,
					};
			case 'items':
			case 'itemgroups':
				// TODO Update single resource ??
				return {
					[`loading_${resource}`]: false,
					[resource]: {
						...(prevState ? prevState[resource] : {}),
						...this.props[resource],
					},
				};
			default:
				throw Error(`Cannot get state for unknown resource '${resource}'`)			
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
		const details = this.state.details;

		// Check values
		if (!REGEX_SLUG.test(details.id)) {
			return this.setState(prevState => produce(prevState, draft => {
				draft.errors.details.id = ["Invalide"];
				return draft;
			}));
		}

		try {
			if (this.isCreator()) {
				// Create sale
				const action = actions.sales.create(null, details);
				const response = await action.payload;
				// Dispatch creation and go to edit mode
				this.props.dispatch(action);
				this.props.history.push(`/admin/sales/${response.data.id}/edit`);
			} else {
				// Update sale details
				this.setState({ saving_details: true });
				this.props.dispatch(actions.sales.update(this.props.saleId, null, details));
			}
		} catch(error) {
			// TODO Test
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
		const id = "fake_" + Math.random().toString(36).slice(2);
		this.setState(prevState => ({
			items: {
				...prevState.items,
				[id]: { id, _isNew: true, ...BLANK_ITEM },
			}
		}))
	}

	handleSaveItem = async event => {
		const saleId = this.props.saleId;
		const id = event.currentTarget.name;
		const { _isNew = false, ...item } = this.state.items[id];
		try {
			if (_isNew) {
				this.setState(prevState => ({
					loading_item: {
						...prevState.loading_item,
						[id]: true,
					}
				}));
				const action = actions.sales(saleId).items.create(null, item);
				await action.payload;

				// Creation succeeded, remove fake id and dispatch created
				this.setState(prevState => produce(prevState, draft => {
					delete draft.items[id];
					return draft;
				}));
				this.props.dispatch(action);
			} else {
				this.props.dispatch(actions.items.update(id, null, item));

			}
		} catch(error) {

		}
	}

	handleAddItemGroup = event => {}

	handleSaveItemGroup = async event => {
		// const item = this.state.items[]
	}


	// Rendering

	render() {
		const isCreator = this.isCreator();
		const title = isCreator ? (
			"Création d'une vente"
		) : (
			"Édition de la vente " + (this.state.name || '...')
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
						<Button onClick={this.handleAddItem}>Ajouter un article</Button>
					</React.Fragment>
				)}
			</div>
		);
	}

}

export default connector(SaleEditor);
