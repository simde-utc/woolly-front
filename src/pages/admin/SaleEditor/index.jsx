import React from 'react'
import { connect } from 'react-redux';
import produce from 'immer';
import apiActions from 'redux/actions/api';
import messagesActions from 'redux/actions/messages';

import { Container, Box } from '@material-ui/core';
import { areDifferent, dataToChoices, arrayToMap, deepcopy } from 'utils/helpers';
import {
	SLUG_REGEX, BLANK_SALE_DETAILS,
	BLANK_ITEMGROUP, BLANK_ITEM, BLANK_ITEMFIELD
} from 'utils/constants';

import Loader from 'components/common/Loader';
import DetailsEditor from './DetailsEditor';
import ItemsManager from './ItemsManager/index';


const QUERY_PARAMS = {
	sale: { with: "is_public,max_item_quantity" },
	items: { include: "itemfields" },
}

const BLANK_RESOURCES = {
	items: BLANK_ITEM,
	itemgroups: BLANK_ITEMGROUP,
};

const connector = connect((store, props) => {
	const saleId = props.match.params.sale_id || null;

	const assos = store.api.getAuthRelatedData('associations', {});
	const usertypes = store.api.get('usertypes');
	const itemgroups = saleId ? store.api.getData(['sales', saleId, 'itemgroups'], {}) : {};
	const fields = store.api.get('fields');

	return {
		saleId,
		sale: saleId ? store.api.getData(['sales', saleId], null) : null,
		items: saleId ? store.api.getData(['sales', saleId, 'items'], {}) : {},
		itemgroups,
		itemgroupsChoices: { ...dataToChoices(itemgroups, 'name'), null: { label: 'Sans groupe', value: 'null' } },

		assosChoices: dataToChoices(assos, 'shortname'),
		usertypes,
		usertypesChoices: dataToChoices(usertypes.data, 'name'),
		fields,
		fieldsChoices: dataToChoices(fields.data, 'name'),
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
			this.props.dispatch(apiActions.usertypes.all());
		if (!this.props.fields.fetched)
			this.props.dispatch(apiActions.fields.all());
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
			// FIXME UI not updating when one item has changed
			for (const resource of ['sale', 'items', 'itemgroups'])
				if (areDifferent(prevProps, this.props, resource))
					this.setState(prevState => this.getStateFor(resource, prevState));
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
		this.props.dispatch(apiActions.sales.find(saleId, QUERY_PARAMS.sale));
		this.props.dispatch(apiActions.sales(saleId).items.all(QUERY_PARAMS.items));
		this.props.dispatch(apiActions.sales(saleId).itemgroups.all(QUERY_PARAMS.itemgroups));
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
						errors: {
							...prevState.errors,
							details: {},
						}
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

	_saveItemFields(item) {
		const changes = {
			to_create: item.itemfields.filter(obj => obj._isNew),
			to_update: [],
			to_delete: [],
		};

		// Get itemfields changes
		const itemfields = arrayToMap(item.itemfields, 'id');
		this.props.items[item.id].itemfields.forEach(({ id, ...prevField }) => {
			if (id in itemfields) {
				if (prevField.editable !== itemfields[id].editable)
					changes.to_update.push([ id, itemfields[id] ]);
			} else {
				changes.to_delete.push(id);
			}
		});

		// Save changes and return a Promise for all calls
		// TODO Get and update items from items(itemId).itemfields
		return Promise.all([
			...changes.to_create.map(data => apiActions.itemfields.create(null, data)),
			...changes.to_update.map(([id, data]) => apiActions.itemfields.update(id, null, data)),
			...changes.to_delete.map(id => apiActions.itemfields.delete(id)),
		].map(action => action.payload));
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

	handleSaveDetails = event => {
		const { _editing, ...details } = this.state.details;

		// Check values
		if (!SLUG_REGEX.test(details.id)) {
			return this.setState(prevState => produce(prevState, draft => {
				draft.errors.details.id = ["Invalide"];
				return draft;
			}));
		}

		this.setState({ saving_details: true }, async () => {
			try {
				if (this.isCreator()) {
					// Create sale
					const action = apiActions.sales.create(QUERY_PARAMS.sale, details);
					const response = await action.payload;
					// Dispatch creation and go to edit mode
					this.props.dispatch(action);
					this.props.history.push(`/admin/sales/${response.data.id}/edit`);
				} else {
					// Update sale details
					const action = apiActions.sales.update(this.props.saleId, QUERY_PARAMS.sale, details);
					await action.payload;
					this.props.dispatch(action);
				}
			} catch(error) {
				this.props.dispatch(messagesActions.pushError(error, "La sauvegarde de la vente a échouée"));
				this.setState(prevState => ({
					saving_details: false,
					errors: {
						...prevState.errors,
						details: error.response.data,
					},
				}));
			}
		});
	}

	handleAddResource = event => {
		// Create a random id only for state purposes
		const id = "fake_" + Math.random().toString(36).slice(2);
		const resource = event.currentTarget.name;
		this.setState(prevState => produce(prevState, draft => {
			draft[resource][id] = { ...BLANK_RESOURCES[resource], id };
			draft.selected = { resource, id };
			return draft;
		}));
	}

	handleSelectResource = event => {
		const resource = event.currentTarget.getAttribute('name');
		const id = event.currentTarget.getAttribute('value');
		event.stopPropagation();
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

		// Set item as loading
		this.setState(prevState => produce(prevState, draft => {
			draft[`saving_${resource}`][id] = true;
			return draft;
		}));
		try {
			if (data._isNew) {
				// Remove fake id
				delete data.id;
				delete data._isNew;
				data.sale = saleId;

				// Create resource
				const action = apiActions.sales(saleId)[resource].create(QUERY_PARAMS[resource], data);
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
				if (resource === 'items')
					await this._saveItemFields(data);

				// Update resource and wait for feedback to dispatch
				const action = apiActions[resource].update(id, QUERY_PARAMS[resource], data)
				await action.payload;

				this.props.dispatch(action);
				this.setState(prevState => produce(prevState, draft => {
					delete draft[`editing_${resource}`][id];
					delete draft[`saving_${resource}`][id];
					return draft;
				}));
			}
		} catch(error) {
			this.props.dispatch(messagesActions.pushError(error, "La sauvegarde de l'item a échouée"));
			console.error(error)
			this.setState(prevState => produce(prevState, draft => {
				delete draft[`editing_${resource}`][id];
				delete draft[`saving_${resource}`][id];
				draft.errors[resource][id] = error.response.data;
				return draft;
			}));
		}
	}

	handleDeleteResource = async event => {
		const { name: resource, value: id } = event.currentTarget;
		const isNew = this.state[resource][id]._isNew;
		this.setState(prevState => produce(prevState, draft => {
			if (resource === 'items')
				this._removeItemFromGroup(draft, id);

			draft.selected = null;
			delete draft[resource][id];
			return draft;
		}), () => isNew || this.props.dispatch(apiActions[resource].delete(id)));
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

	handleItemFieldChange = item => event => {
		const { name: action, value: index } = event.currentTarget;
		this.setState(prevState => produce(prevState, draft => {
			const itemfields = draft.items[item].itemfields;
			switch (action) {
				case 'add':
					itemfields.push({ ...BLANK_ITEMFIELD, item });
					break;
				case 'delete':
					itemfields.splice(index, 1);
					break;
				default:
					throw Error(`Unknown action '${action}'`)
			}
			return draft;
		}));
	}

	// Rendering

	render() {
		const isCreator = this.isCreator();
		return (
			<Container>
	            <Box clone mb={3} mt={6} textAlign="center">
	                <h2>Détails</h2>
	            </Box>
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
					<React.Fragment>
			            <Box clone mb={3} mt={6} textAlign="center">
			                <h2>Articles</h2>
			            </Box>
						<ItemsManager
							// Data
							selected={this.state.selected}
							items={this.state.items}
							itemgroups={this.state.itemgroups}
							usertypes={this.props.usertypes.data}
							errors={this.state.errors}
							choices={{
								fields: this.props.fieldsChoices,
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
							onItemFieldChange={this.handleItemFieldChange}
							// State data
							editing={{
								items: this.state.editing_items,
								itemgroups: this.state.editing_itemgroups,
							}}
							saving={{
								items: this.state.saving_items,
								itemgroups: this.state.saving_itemgroups,
							}}
						/>
					</React.Fragment>
				)}
			</Container>
		);
	}

}

export default connector(SaleEditor);
