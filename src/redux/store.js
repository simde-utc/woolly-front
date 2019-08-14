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
import { createStore, applyMiddleware, compose } from 'redux';

// Import Middlewares
import thunk from 'redux-thunk';
import { createPromise } from 'redux-promise-middleware';
// import { createLogger } from 'redux-logger';


// =============================================================
// 		Middlewares
// =============================================================

// Suffixes des actions asynchrones
const ASYNC_SUFFIXES = {
	loading: 'LOADING',
	success: 'SUCCESS',
	error: 'ERROR',
};

// Configure Middlewares
let middlewares = applyMiddleware(
	thunk,
	createPromise({ promiseTypeSuffixes: Object.values(ASYNC_SUFFIXES) }),
	// createLogger({ collapse: true }),
);

/* eslint-disable no-underscore-dangle */
if (process.env.NODE_ENV === 'development') {
	middlewares = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(middlewares);
}
/* eslint-enable no-underscore-dangle */


// TODO
function processPagination(payload) {
	if ('results' in payload) {
		const { results, ...rest } = payload;
		return { data: results, pagination: rest };
	} else {
		return { data: payload, pagination: {} };
	}
}


// =============================================================
// 		Resource helpers
// =============================================================

// Base storage for each resource
export const INITIAL_REST_STATE = {
	data: {},
	error: null,
	failed: false,
	status: null,
	fetching: false,
	fetched: false,
	lastUpdate: null,
	pagination: {},
	resources: {},
};

/** Init a state by deep copying the initialState properties into it */
function initRestState(state, initialState = INITIAL_REST_STATE) {
	for (const key in initialState) {
		if (initialState.hasOwnProperty(key)) {
			if (initialState[key] instanceof Object) {
				state[key] = Array.isArray(initialState[key]) ? [] : {};
				initRestState(state[key], initialState[key]);
			} else {
				state[key] = initialState[key];
			}
		}
	}
	return state;
};

/** Dynamically generate the resource storage in the store from the path */
function buildStorePath(store, path) {
	for (const step of path) {
		// Create nested resources if doesn't exist
		if (store.resources[step] === undefined) {
			store.resources[step] = {};
			initRestState(store.resources[step]);
		}

		// Go forward in the path
		store = store.resources[step];
	}
	return store;
};

function makeResourceSuccessful(store, timestamp, status) {
	store.fetching = false;
	store.fetched = true;
	store.error = null;
	store.failed = false;
	store.lastUpdate = timestamp;
	store.status = status;
	return store;
}


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

/** Helper to get path and id from an action meta */
function getPathFromMeta(meta) {
	let path = meta.path;
	let id = undefined;

	// Pop id from path if needed
	if (!['updateAll', 'create', 'insert'].includes(meta.action)) {
		path = path.slice();
		id = path.pop();
	}
	return { path, id };
}

// La racine du store
export const store = {
	/**
	 * Casse une route uri (string) en array
	 * Exemple: 'assos/calendars' => ['assos', 'calendars']
	 */
	pathToArray(path) {
		if (typeof path === 'string')
			path = path.split('/');

		return (path instanceof Array) ? path : [];
	},

	// TODO
	mergePath(path, ...steps) {
		return this.pathToArray(path).concat(steps);
	},

	/**
	 * Easy access an element in the store
	 * Should NOT return copied data from the store (arr.map, Object.values) for better performance
	 * 
	 * @param      {<type>}   path                      The path to the target resource
	 * @param      {<type>}   [replacement={}]          The returned Objet if the resource if infindable
	 * @param      {boolean}  [forceReplacement=false]  Return remplacement resource is empty or null
	 */
	get(path, replacement = {}, forceReplacement = false) {
		let data = this;
		path = this.pathToArray(path);

		// Find the resource from the path
		for (const step of path) {
			if (data[step] !== undefined)
				data = data[step];
			else if (data.resources && data.resources[step] !== undefined)
				data = data.resources[step];
			else
				return replacement;
		}

		// Return replacement if the data is empty or null
		if (forceReplacement && (data == null || (data instanceof Object && Object.keys(data).length === 0)))
			return replacement;

		return data;
	},

	/** Retrieve the data object of a resource */
	getData(path, replacement = {}, forceReplacement = true) {
		return this.get(this.mergePath(path, 'data'), replacement, forceReplacement);
	},

	/** Retrieve the data with a particuliar value of a resource */
	findData(path, value, key = 'id', replacement = null, forceReplacement = true) {
		// TODO
		// Resources are stored by id
		if (key === 'id') {
			return this.getData(this.mergePath(path, value), replacement, forceReplacement);
		}

		const data = this.getData(path, []);
		for (const k in data) {
			if (data[k][key] === value) {
				if (!forceReplacement || !(data[k] instanceof Object) || Object.keys(data[k]).length > 0) {
					return data[k];
				}
			}
		}

		return replacement;
	},

	// TODO
	getRessources(props, replacement = null, forceReplacement = true) {
		return this.get(this.mergePath(props, 'resources'), replacement, forceReplacement);
	},
	getError(props, replacement = null, forceReplacement = true) {
		return this.get(this.mergePath(props, 'error'), replacement, forceReplacement);
	},
	hasFailed(props, replacement = false, forceReplacement = true) {
		return this.get(this.mergePath(props, 'failed'), replacement, forceReplacement);
	},
	getStatus(props, replacement = null, forceReplacement = true) {
		return this.get(this.mergePath(props, 'status'), replacement, forceReplacement);
	},
	getLastUpdate(props, replacement = null, forceReplacement = true) {
		return this.get(this.mergePath(props, 'lastUpdate'), replacement, forceReplacement);
	},
	isFetching(props, replacement = false, forceReplacement = true) {
		return this.get(this.mergePath(props, 'fetching'), replacement, forceReplacement);
	},
	isFetched(props, replacement = false, forceReplacement = true) {
		return this.get(this.mergePath(props, 'fetched'), replacement, forceReplacement);
	},
	getPagination(props, replacement = false, forceReplacement = true) {
		return this.get(this.mergePath(props, 'pagination'), replacement, forceReplacement);
	},
	// Permet de savoir si une requête s'est terminée
	hasFinished(path, replacement = false, forceReplacement = true) {
		const data = this.get(this.pathToArray(path), {}, true);
		return Boolean(data.fetched && data.failed);
	},

	// TODO Storages
	resources: {},
	config: {},

	// TODO Custom methods
	getAuthUser(...steps) {
		return this.get(['auth', 'data', 'user', ...steps], null, true);
	},
	getAuthRelated(...steps) {
		return this.get(['auth', 'resources', ...steps], {}, true);
	},
};

// TODO Define accessors

// TODO id ??

/**
 * This reducer manages the async CRUD operations and ???
 */
export const reducer = (state = store, action) => {

	if (action.meta && action.meta.path && action.meta.path.length > 0) {
		return produce(state, draft => {
			// Get path and id from action.meta
			let { path, id } = getPathFromMeta(action.meta);
			let place = buildStorePath(draft, path);

			// Async call is loading
			if (action.type.endsWith(`_${ASYNC_SUFFIXES.loading}`)) {
				place.fetching = true;
				place.status = null;
				return draft;
			}

			const statusIsValid = action.meta.validStatus.includes(action.payload.status || action.payload.response.status);

			// Async call has failed
			if (action.type.endsWith(`_${ASYNC_SUFFIXES.error}`)) {
				// if (id) // TODO ????
				// 	place = buildStorePath(draft, path.concat([id]));

				// place.data = {};
				place.fetching = false;
				place.fetched = statusIsValid;
				place.error = action.payload;
				place.failed = statusIsValid;
				place.status = action.payload.response.status;
				return draft;
			}

			// Async call has succeeded
			if (action.type.endsWith(`_${ASYNC_SUFFIXES.success}`)) {

				// HTTP status is not acceptable
				if (!statusIsValid) {
					// place.data = {};
					place.fetching = false;
					place.fetched = false;
					place.error = 'NOT ACCEPTED';
					place.failed = true;
					place.status = action.payload.status;
					return draft;
				}

				// Set pagination, timestamp, status and others indicators
				const { timestamp, status } = action.payload;
				const { data, pagination } = processPagination(action.payload.data);
				if (pagination) place.pagination = pagination
				place = makeResourceSuccessful(place, timestamp, status);
				id = id || data.id; // TODO

				// Helper to build a store for the data if it has a key or an id
				function buildSuccessfulDataStorePath(element, key) {
					if (key) {
						let placeForData = buildStorePath(draft, path.concat([key]));
						placeForData = makeResourceSuccessful(placeForData, timestamp, status);
						placeForData.data = element;
					}
				}

				// Update the data and resources according to the action required
				if (action.meta.action === 'updateAll') {
					// Multiple elements

					// Modify data and Create places in resources for each element according to id
					if (Array.isArray(data)) {      // Array: Multiple elements with id
						for (const element of data) {
							const e_id = element.id; // TODO
							place.data[e_id] = element;
							buildSuccessfulDataStorePath(element, e_id);
						}
					} else if (id) {                // Resource with id: Single id
						place.data = data;
						buildSuccessfulDataStorePath(data, id);
					} else {                        // Resource without id: keys for resources
						// TODO Check object, Useful ??
						place.data = data;
						// for (const key in data)
						// 	buildSuccessfulDataStorePath(data[key], key);
					}

				} else {
					// Single element 

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
combineReducers({
	resources: reducer,
	...NAMESPACES_CONFIG,
})
*/

// Finally create and export the redux store
export default createStore(reducer, middlewares);
