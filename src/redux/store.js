/**
 * Création et gestion automatique et dynmaique du store géré par redux (store refait sur la base du travail d'Alexandre)
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Alexandre Brasseur <abrasseur.pro@gmail.com>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license GNU GPL-3.0
 */

import produce from 'immer';
import { createStore, applyMiddleware } from 'redux';
import { deepcopy, isEmpty } from '../utils';

// Import Middlewares
import thunk from 'redux-thunk';
import { createPromise } from 'redux-promise-middleware';


/*
|---------------------------------------------------------
|		Middlewares
|---------------------------------------------------------
*/

// Suffixes des actions asynchrones
const ASYNC_SUFFIXES = {
	loading: 'LOADING',
	success: 'SUCCESS',
	error: 'ERROR',
};

// Configure Middlewares
const middlewares = applyMiddleware(
	thunk,
	createPromise({ promiseTypeSuffixes: Object.values(ASYNC_SUFFIXES) }),
	// require('redux-logger').createLogger({ collapsed: true }),
);


/*
|---------------------------------------------------------
|		Path helpers
|---------------------------------------------------------
*/

/**
 * Split a URI route into an array
 * Example: 'assos/1/calendars' => ['assos', '1', 'calendars']
 */
export function pathToArray(path) {
	if (typeof path === 'string')
		return path.split('/');
	else if (path instanceof Array)
		return path.slice();
	else
		return [];
}

function mergePath(path, ...additionalSteps) {
	return pathToArray(path).concat(additionalSteps);
}

/** Helper to get path and id from an action meta */
function getPathFromMeta(meta) {
	const path = meta.path.slice();
	let id = undefined;

	// Pop id from path if needed
	if (!['updateAll', 'create', 'insert'].includes(meta.action)) {
		id = path.pop();
	}
	return { path, id };
}


/*
|---------------------------------------------------------
|		Store
|---------------------------------------------------------
| This API store is auto building itself with each request
*/

export const API_PREFIX = 'API';
export const MESSAGE_PREFIX = 'MESSAGE';

// Base storage for each resource
export const INITIAL_RESOURCE_STATE = {
	data: {},							// A map of the needed data by id
	error: null,
	failed: false,
	status: null,
	fetching: false,
	fetched: false,
	lastUpdate: null,
	pagination: {},
	resources: {},
};

// La racine du store
export const apiStore = {

	// Actual store
	resources: {},
	messages: {},

	/**
	 * Easy access an element in the store
	 * Should NOT return copied data from the store (arr.map, Object.values) for better performance
	 * 
	 * @param      {<type>}   path                      The path to the target resource
	 * @param      {<type>}   [replacement={}]          The returned Objet if the resource if infindable
	 * @param      {boolean}  [forceReplacement=false]  Return remplacement resource is empty or null
	 */
	get(path, replacement = INITIAL_RESOURCE_STATE, forceReplacement = true) {
		let data = this;

		// Find the resource from the path
		// Search in direct data and in resources
		for (const step of pathToArray(path)) {
			if (data[step] !== undefined)
				data = data[step];
			else if (data.resources && data.resources[step] !== undefined)
				data = data.resources[step];
			else
				return replacement;
		}

		// Return replacement if the data is empty or null
		if (forceReplacement && isEmpty(data))
			return replacement;

		return data;
	},

	/** Retrieve the data object of a resource */
	getData(path, replacement = {}, forceReplacement = true) {
		return this.get(mergePath(path, 'data'), replacement, forceReplacement);
	},

	/** Retrieve the data with a particuliar value of a resource */
	findData(path, value, key = 'id', replacement = null, forceReplacement = true) {
		// Data is stored by id
		if (key === 'id')
			return this.getData(mergePath(path, value), replacement, forceReplacement);

		// Otherwise, search the data for the right key
		const data = this.getData(path);
		for (const k in data)
			if (data[k][key] === value)
				return data[k];

		return replacement;
	},

	/**
	 * Get specified resource for multiple data by id
	 * Example: ('sales', 'assos') => { a: asso_of_sale_a, b: asso_of_sale_b }
	 * 
	 * @param  {[type]} path        [description]
	 * @param  {[type]} resource    [description]
	 * @param  {[type]} replacement [description]
	 * @return {Object}             La map de resource par id
	 */
	getResourceDataById(path, resource, replacement = null) {
		const pathResources = this.get(path).resources;
		return Object.keys(pathResources).reduce((acc, id) => {
			const subResources = pathResources[id].resources[resource] || {};
			acc[id] = subResources.fetched ? subResources.data : replacement;
			return acc;
		}, {});
	},

	// TODO Custom methods
	getAuthUser(path, replacement = null, forceReplacement = true) {
		return this.get(['auth', 'data', 'user', ...pathToArray(path)], replacement, forceReplacement);
	},
	getAuthRelatedData(path, replacement = {}, forceReplacement = true) {
		return this.getData(['auth', 'resources', ...pathToArray(path)], replacement, forceReplacement);
	},
};


/*
|---------------------------------------------------------
|		Resource helpers
|---------------------------------------------------------
*/

/**
 * Dynamically generate the resource storage in the store from the path
 * @param  {Object}   store The Redux API store
 * @param  {String[]} path  The path to the place wanted
 * @return {Object}         The place located at the required steps
 */
function buildPathInStore(store, path) {
	return path.reduce((place, step) => {
		// Create nested resources if doesn't exist
		if (place.resources[step] === undefined)
			place.resources[step] = deepcopy(INITIAL_RESOURCE_STATE);

		// Go forward in the path
		return place.resources[step];
	}, store);
}

function makeResourceSuccessful(resource, timestamp, status) {
	resource.fetching = false
	resource.fetched = true
	resource.error = null
	resource.failed = false
	resource.lastUpdate = timestamp
	resource.status = status
	return resource
}

function processPagination(payload) {
	if (payload.hasOwnProperty('results')) {
		const { results, ...pagination } = payload;
		return { data: results, pagination: pagination };
	} else {
		return { data: payload, pagination: null };
	}
}


/*
|---------------------------------------------------------
|		Reducer
|---------------------------------------------------------
*/

/** This reducer manages the async API operations */
export const apiReducer = (state = apiStore, action) => {

	// Message system actions
	if (action.type && action.type.startsWith(MESSAGE_PREFIX)) {
		return produce(state, draft => {
			const data = action.payload;
			switch (action.type) {
				case `${MESSAGE_PREFIX}_PUSH`:
					draft.messages[data.id] = data;
					break;
				case `${MESSAGE_PREFIX}_POP`:
					delete draft.messages[data.id];
					break;
				default:
					break;
			}
			return draft;
		})
	}

	// Api actions
	if (action.type && action.type.startsWith(API_PREFIX)) {
		return produce(state, draft => {
			// Get path and id from action.meta
			let { path, id } = getPathFromMeta(action.meta);
			let place = buildPathInStore(draft, path);

			// CASE LOADING: Async call is loading
			if (action.type.endsWith(`_${ASYNC_SUFFIXES.loading}`)) {
				place.fetching = true;
				place.status = null;
				return draft;
			}

			const status = (action.payload.status || (
				action.payload.response && action.payload.response.status
			));
			const statusIsValid = action.meta.validStatus.includes(status);

			// ====== CASE ERROR: Async call has failed
			if (action.type.endsWith(`_${ASYNC_SUFFIXES.error}`)) {
				// if (id) // TODO ????
				// 	place = buildPathInStore(draft, path.concat([id]));

				// place.data = {};
				place.fetching = false;
				place.fetched = statusIsValid;
				place.error = action.payload;
				place.failed = statusIsValid;
				place.status = status;
				return draft;
			}

			// Async call has succeeded
			if (action.type.endsWith(`_${ASYNC_SUFFIXES.success}`)) {

				// ====== CASE HTTP ERROR: HTTP status is not acceptable
				if (!statusIsValid) {
					// place.data = {};
					place.fetching = false;
					place.fetched = false;
					place.error = 'NOT ACCEPTED';
					place.failed = true;
					place.status = action.payload.status;
					return draft;
				}

				// ====== CASE SUCCESS: Update store

				// Set pagination, timestamp, status and others indicators
				const { timestamp, status } = action.payload;
				const { data, pagination } = processPagination(action.payload.data);
				if (pagination)
					place.pagination = pagination

				// The resource place where to store the data
				place = makeResourceSuccessful(place, timestamp, status);
				id = id || data.id; // TODO

				// Helper to build a store for the data if it has a key or an id
				function buildSuccessfulDataStorePath(element, key) {
					if (key) {
						let placeForData = buildPathInStore(draft, path.concat([key]));
						placeForData = makeResourceSuccessful(placeForData, timestamp, status);
						placeForData.data = element;
					}
				}

				// Update the data and resources according to the action required
				if (action.meta.action === 'updateAll') {
					// Multiple elements

					// Modify data and Create places in resources for each element according to id
					if (Array.isArray(data)) {      // Array: Multiple elements with id
						data.forEach(element => {
							const e_id = element.id; // TODO
							place.data[e_id] = element;
							buildSuccessfulDataStorePath(element, e_id);
						});
					} else if (id) {                // Resource with id: Single id
						place.data = data;
						buildSuccessfulDataStorePath(data, id);
					} else {                        // Resource without id: keys for resources
						// TODO Check object, Useful ??
						place.data = data;
						// for (const key in data)
						// 	buildSuccessfulDataStorePath(data[key], key);
					}

				} else {			// Single element 

					// Modify place.data and place.resources
					if (['create', 'insert', 'update'].includes(action.meta.action)) {
						if (id) {
							place.data[id] = data;
							buildSuccessfulDataStorePath(data, id);
						} else {
							place.data = data;
							for (const key in data)
								buildSuccessfulDataStorePath(data[key], key);
						}
					} else if ('delete' === action.meta.action) {
							if (id) {
								delete place.data[id];
								delete place.resources[id];
							} else {
								place.data = {};
								place.resources = {};
							}
					}
				}

				return draft;
			}

			// Return the draft state anyway
			return draft;
		});
	}
	
	return state;
}

/*
// TODO
const NAMESPACES_CONFIG = {
	config: {
		type: 'CONFIG',
		reducer: (state = {}, action) => ({
			...state,
			config: {
				...state.config,
				...action.payload,
			},
		}),
	},
}

combineReducers({
	resources: apiReducer,
	...NAMESPACES_CONFIG,
})
*/

// Finally create and export the redux store
export default createStore(apiReducer, middlewares);
