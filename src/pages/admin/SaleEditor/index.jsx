import React from 'react'
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../redux/actions';
import produce from 'immer';

import { REGEX_SLUG, BLANK_SALE_DETAILS, BLANK_ITEMGROUP, BLANK_ITEM } from '../../../constants';
import { areDifferent, dataToChoices, deepcopy } from '../../../utils';

import { Grid, Button, Paper } from '@material-ui/core';
import DetailsEditor from './DetailsEditor';
import ItemsDisplay from './ItemsDisplay';
import ItemEditor from './ItemEditor';
import Loader from '../../../components/common/Loader';


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
		window.props = this.props;  // DEBUG
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
					loading_itemgroups: false,
					saving_details: false,
					saving_item: {},
					saving_itemgroup: {},
				};
			case 'sale':
				if (this.props.sale === null)
					return { loading_details: true };
				else
					return {
						name: this.props.sale.name,
						details: this.props.sale,
						loading_details: false,
						saving_details: false,
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
		const { maxsize } = event.currentTarget.dataset;
		if (maxsize)
			value = value.slice(maxsize)

		// Update value in state
		this.setState(prevState => produce(prevState, draft => {
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
	}

	handleSaveResource = async event => {
		const saleId = this.props.saleId;
		const { name: resource, value: id } = event.currentTarget;
		let data = deepcopy(this.state[resource][id]);
		delete data._editing;

		// TODO Set item as loading
		// this.setState(prevState => produce(prevState, draft => {
		// 	draft[`saving_${resource}`][id] = true;
		// 	return draft;
		// }));

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
					
					// delete draft[`saving_${resource}`][id];
					draft.selected = null;
					delete draft[resource][id];
					return draft;
				}), () => this.props.dispatch(action));
			} else {
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
				details: props.sales,
			}));
		} else {
			this.setState((prevState, props) => ({
				[resource]: {
					...prevState[resource],
					[id]: props[resource][id],
				},
			}));
		}
	}

	// Rendering

	renderArticles() {
		if (this.state.loading_items || !this.props.usertypes.fetched)
			return <Loader text="Chargement des articles..." />

		const selected = this.state.selected;
		const display = (
			<ItemsDisplay
				items={this.state.items}
				itemgroups={this.state.itemgroups}
				usertypes={this.props.usertypes.data}
				handleSelect={this.handleSelectResource}
				selected={selected}
			/>
		);

		let editor = null;
		let editorTitle = null;
		if (selected) {
			const resource = this.state[selected.resource][selected.id]
			const isNew = resource && resource._isNew;
			const editorProps = {
				'onChange': this.handleChange,
				'onSave': this.handleSaveResource,
				'onDelete': this.handleDeleteResource,
				'onReset': this.handleResetResource,
			};
			editorTitle = isNew ? "Ajouter " : "Modifier ";

			if (selected.resource === 'items') {
				editorTitle += "un article";
				editor = (
					<ItemEditor
						item={resource}
						itemgroups={this.props.itemgroupsChoices}
						usertypes={this.props.usertypesChoices}
						errors={this.state.errors.items[selected.id] || {}}
						//saving={this.state.saving_details}
						{...editorProps}
					/>
				);
			}
			else if (selected.resource === 'itemgroups') {
				editorTitle += "un groupe";
				editor = 'TODO'
			}
		}

		return (
			<React.Fragment>
				<Grid container spacing={4}>
					<Grid item md={editor ? 6 : 12}>
						<h2>Articles</h2>
						{display}
					</Grid>
					{editor && <Grid item md={6}>
						<h2>{editorTitle}</h2>
						{editor}
					</Grid>}
				</Grid>
				<div style={{ textAlign: 'center' }}>
					<Button onClick={this.handleAddResource} name="itemgroups">
						Ajouter un groupe
					</Button>
					<Button onClick={this.handleAddResource} name="items">
						Ajouter un article
					</Button>
				</div>
			</React.Fragment>
		);
	}

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
					<Paper>
						<DetailsEditor
							details={this.state.details}
							errors={this.state.errors.details}
							assos={this.props.assosChoices}
							saving={this.state.saving_details}
							isCreator={isCreator}
							onChange={this.handleChange}
							onSave={this.handleSaveDetails}
						/>
					</Paper>
				)}

				{!isCreator && this.renderArticles()}
			</div>
		);
	}

}

export default connector(SaleEditor);
