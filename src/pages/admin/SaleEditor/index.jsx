import React from 'react'
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../redux/actions';
import produce from 'immer';

import { Container } from '@material-ui/core';

import { REGEX_SLUG, BLANK_SALE_DETAILS, BLANK_ITEMGROUP, BLANK_ITEM } from '../../../constants';
import { areDifferent, dataToChoices, deepcopy } from '../../../utils';

import Loader from '../../../components/common/Loader';
import DetailsEditor from './DetailsEditor';
import ItemsManager from './ItemsManager/';


const BLANK_RESOURCES = {
	items: BLANK_ITEM,
	itemgroups: BLANK_ITEMGROUP,
};

const connector = connect((store, props) => {
	const saleId = props.match.params.sale_id || null;

	const assos = store.getAuthRelatedData('associations', {});
	const usertypes = store.get('usertypes');
	const itemgroups = saleId ? store.getData(['sales', saleId, 'itemgroups'], {}) : {};

	return {
		saleId,
		assosChoices: dataToChoices(assos, 'shortname'),
		usertypes,
		usertypesChoices: dataToChoices(usertypes.data, 'name'),
		sale: saleId ? store.getData(['sales', saleId], null) : null,
		items: saleId ? store.getData(['sales', saleId, 'items'], {}) : {},
		itemgroups,
		itemgroupsChoices: dataToChoices(itemgroups, 'name').concat({ label: 'Sans groupe', value: 'null' }),
		// itemfields: saleId ? store.getData(['items', itemId, 'itemfields'], {}) : {},
		fields: store.getData(['fields'], {}),
	};
})

class SaleEditor extends React.Component {

	constructor(props) {
		super(props);
		this.state = this.getStateFor('create');
	}

	// Props and state management

	componentDidMount() {
		if (!this.isCreator())
			this.fetchData();

		// Fetch side resources
		if (!this.props.usertypes.fetched)
			this.props.dispatch(actions.usertypes.all());
		if (!this.props.fields.fetched)
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
					this.setState(prevState => this.getStateFor(resource, !differentSale && prevState));
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

	getStateFor(resource, prevState = {}) {
		switch (resource) {
			case 'create':
				const association = (
					this.props.location.state
					&& this.props.location.state.asso_id
				) || null;
				return {
					details: {
						...BLANK_SALE_DETAILS,
						association,
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
					loading_itemgroups: false,
					editing_details: false,
					editing_item: {},
					editing_itemgroup: {},
					saving_details: false,
					saving_items: {},
					saving_itemgroups: {},
				};
			case 'sale':
				if (this.props.sale === null)
					return { loading_details: true };
				else
					return {
						name: this.props.sale.name,
						details: this.props.sale,
						loading_details: false,
						editing_details: false,
						saving_details: false,
					};
			case 'items':
			case 'itemgroups':
				// TODO Update single resource ??
				return {
					[`loading_${resource}`]: false,
					[`editing_${resource}`]: {},
					[`saving_${resource}`]: {},
					[resource]: {
						...(prevState[resource] || {}),
						...this.props[resource],
					},
				};
			default:
				throw Error(`Cannot get state for unknown resource '${resource}'`)			
		}
	}

	// Handlers

	_removeItemFromGroup(draft, itemId) {
		itemId = String(itemId)
		const item = draft.items[itemId];
		const group = draft.itemgroups[item.group];
		if (group)
			group.items = group.items.filter(id => String(id) !== itemId)
	}

	handleChange = event => {
		const valueKey = event.target.hasOwnProperty('checked') ? 'checked' : 'value';
		let value = event.target[valueKey];

		const name = event.target.name;
		const steps = name.split('.');
		const n = steps.length - 1;

		// Value verification
		const options = event.target.dataset || {};
		if (options.maxsize)
			value = value.slice(options.maxsize)

		// Update value in state
		this.setState(prevState => produce(prevState, draft => {
			// Set as editing
			if (steps[0] === 'details')
				draft.editing_details = true;
			else
				draft[`editing_${steps[0]}`][steps[1]] = true;

			// Change item group
			if (steps[0] === 'items' && steps[n] === 'group') {
				const itemId = steps[1];
				this._removeItemFromGroup(draft, itemId);

				// Clean if without new group or Add item id to new group
				if (value === 'null')
					value = null;
				else if (draft.itemgroups[value])
					draft.itemgroups[value].items.push(itemId);
			}

			steps.reduce((place, step, index, steps) => {
				// Set as editing
				if (step === 'details' || (steps[0] !== 'details' && index === 1))
					place[step]._editing = true;

				// Update last value
				if (index === n)
					place[step] = value;

				// Go forward
				return place[step];
			}, draft);
			return draft;
		}));
	}

	handleSaveDetails = async event => {
		const { _editing, ...details } = this.state.details;

		// Check values
		if (!REGEX_SLUG.test(details.id)) {
			return this.setState(prevState => produce(prevState, draft => {
				draft.errors.details.id = ["Invalide"];
				return draft;
			}));
		}

		try {
			this.setState({ saving_details: true });
			if (this.isCreator()) {
				// Create sale
				const action = actions.sales.create(null, details);
				const response = await action.payload;
				// Dispatch creation and go to edit mode
				this.props.dispatch(action);
				this.props.history.push(`/admin/sales/${response.data.id}/edit`);
			} else {
				// Update sale details
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

	handleAddResource = event => {
		// Create a random id only for state purposes
		const resource = event.currentTarget.name;
		const id = "fake_" + Math.random().toString(36).slice(2);
		this.setState(prevState => ({
			[resource]: {
				...prevState[resource],
				[id]: {
					id,
					_isNew: true,
					...BLANK_RESOURCES[resource],
				},
			},
			selected: { resource, id },
		}))
	}

	handleSelectResource = event => {
		const resource = event.currentTarget.getAttribute('name');
		const id = event.currentTarget.getAttribute('value');
		if (id)
			this.setState({ selected: { resource, id } });
		if (resource === 'unselect')
			this.setState({ selected: null });
	}

	handleSaveResource = async event => {
		const saleId = this.props.saleId;
		const { name: resource, value: id } = event.currentTarget;
		let data = deepcopy(this.state[resource][id]);
		delete data._editing;

		// TODO Set item as loading
		this.setState(prevState => produce(prevState, draft => {
			draft[`saving_${resource}`][id] = true;
			return draft;
		}));
		try {
			if (data._isNew) {
				delete data.id; // Remove fake id
				delete data._isNew;
				data.sale = saleId;

				// Create resource
				const action = actions.sales(saleId)[resource].create(null, data);
				await action.payload;

				// Creation succeeded, remove fake id and dispatch created
				this.setState(prevState => produce(prevState, draft => {
					if (resource === 'items')
						this._removeItemFromGroup(draft, id);
					
					delete draft[`editing_${resource}`][id];
					delete draft[`saving_${resource}`][id];
					draft.selected = null;
					delete draft[resource][id];
					return draft;
				}), () => this.props.dispatch(action));
			} else {
				this.setState(prevState => produce(prevState, draft => {
					delete draft[`editing_${resource}`][id];
					delete draft[`saving_${resource}`][id];
					return draft;
				}));
				this.props.dispatch(actions[resource].update(id, null, data));
			}
		} catch(error) {
			this.setState(prevState => ({
				errors: {
					...prevState.errors,
					[resource]: {
						...prevState.errors[resource],
						[id]: error.response.data,
					}
				},
			}));
		}
	}

	handleDeleteResource = async event => {
		const { name: resource, value: id } = event.currentTarget;
		this.setState(prevState => produce(prevState, draft => {
			if (resource === 'items')
				this._removeItemFromGroup(draft, id);

			draft.selected = null;
			delete draft[resource][id];
			return draft;
		}), () => this.props.dispatch(actions[resource].delete(id)));
	}

	handleResetResource = event => {
		const { name: resource, value: id } = event.currentTarget;
		if (resource === 'details') {
			this.setState((prevState, props) => ({
				details: props.sale,
				editing_details: false,
			}));
		} else {
			const editing = `editing_${resource}`;
			this.setState((prevState, props) => ({
				[resource]: {
					...prevState[resource],
					[id]: props[resource][id],
				},
				[editing]: {
					...prevState[editing],
					[id]: false,
				},
			}));
		}
	}

	// Rendering

	render() {
		const isCreator = this.isCreator();
		const selected = this.state.selected;
		const title = isCreator ? (
			"Création d'une vente"
		) : (
			"Édition de la vente " + (this.state.name || '...')
		);

		return (
			<Container>
				<h1>{title}</h1>
				
				<h2>Détails</h2>
				{this.state.loading_details ? (
					<Loader text="Chargement des détails de la vente..." />
				) : (
						<DetailsEditor
							// Data
							details={this.state.details}
							errors={this.state.errors.details}
							assos={this.props.assosChoices}
							isCreator={isCreator}
							// Handlers
							onChange={this.handleChange}
							onSave={this.handleSaveDetails}
							onReset={this.handleResetResource}
							// State
							editing={this.state.editing_details}
							saving={this.state.saving_details}
						/>
				)}

				{!isCreator && (
					<ItemsManager
						// Data
						selected={selected}
						items={this.state.items}
						itemgroups={this.state.itemgroups}
						usertypes={this.props.usertypes.data}
						errors={this.state.errors}
						choices={{
							itemgroups: this.props.itemgroupsChoices,
							usertypes: this.props.usertypesChoices,
						}}
						// Handlers
						onChange={this.handleChange}
						onSave={this.handleSaveResource}
						onDelete={this.handleDeleteResource}
						onReset={this.handleResetResource}
						onAdd={this.handleAddResource}
						onSelect={this.handleSelectResource}
						editing={{
							items: this.state.editing_items,
							itemgroups: this.state.editing_itemgroups,
						}}
						saving={{
							items: this.state.saving_items,
							itemgroups: this.state.saving_itemgroups,
						}}
					/>
				)}
			</Container>
		);
	}

}

export default connector(SaleEditor);
