import produce from 'immer';
import { deepcopy, isEmpty } from '../../utils';
import { DEFAULT_PAGE_SIZE } from '../../constants';
import { API_REDUX_PREFIX, ASYNC_SUFFIXES, DATA_CHANGES, DATA_SCOPES } from '../constants';

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

/**
 * Helper to get path and id from an action meta
 */
function getPathFromMeta(meta) {
	const path = meta.path.slice();
	let id = undefined;

	// Pop id from path if needed
	if (meta.idIsGiven)
		id = path.pop();

	return { path, id };
}


/*
|---------------------------------------------------------
|		Default Store
|---------------------------------------------------------
| This API store is auto building itself with each request
*/

// Base storage for each resource
export const INITIAL_RESOURCE_STATE = {
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

// La racine du store
export const DEFAULT_API_STORE = {

	// Actual store
	resources: {},

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
	getData(path, replacement = null, forceReplacement = false) {
		return this.get([ ...pathToArray(path), 'data'], replacement, forceReplacement);
	},

	/** Retrieve the data with a particuliar value of a resource */
	findData(path, value, key = 'id', replacement = null, forceReplacement = true) {
		// Data is stored by id
		if (key === 'id')
			return this.getData([ ...pathToArray(path), value], replacement, forceReplacement);

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
	// TODO API REDUCER Useful ?
	getResourceDataById(path, resource, replacement = null) {
		const pathResources = this.get(path).resources;
		return Object.keys(pathResources).reduce((acc, id) => {
			const subResources = pathResources[id].resources[resource] || {};
			acc[id] = subResources.fetched ? subResources.data : replacement;
			return acc;
		}, {});
	},

	getStatus(path, id = null) {
		// TODO
	},

	getPagination(path) {
		// TODO ?
	},

	getError() {
		// TODO
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

/**
 * Make a resource place successful
 */
function makeResourceSuccessful(resource, timestamp, status) {
	resource.fetching = false
	resource.fetched = true
	resource.error = null
	resource.failed = false
	resource.lastUpdate = timestamp
	resource.status = status
}

/**
 * Apply a change to one element in place according to dataChange
 */
function changeOneElement(place, dataChange, id, element, timestamp, status) {
	if (id == null)
		throw Error(`Invalid id ${id}`)

	switch (dataChange) {
		case DATA_CHANGES.ASSIGN:
			place.data[id] = element;

			if (place.resources[id] === undefined)
				place.resources[id] = deepcopy(INITIAL_RESOURCE_STATE);

			// Duplicate element in resources as it is only a pointer
			makeResourceSuccessful(place.resources[id], timestamp, status);
			place.resources[id].data = element;
			break;

		case DATA_CHANGES.REMOVE:
			delete place.data[id];
			if (place.resources[id] !== undefined)
				delete place.resources[id]
			break;

		default:
			throw Error(`Unknown dataChange ${dataChange}`)
	}
}

/**
 * Parse the pagination next and previous url to extract queryParams
 */
function parsePaginationUrl(url) {
	if (url == null)
		return {};
	const params = new URL(url).searchParams;
	return {
		page: parseInt(params.get('page')) || undefined,
		pageSize: parseInt(params.get('page_size')) || undefined,
	};
}

/**
 * Process pagination in place and return results
 */
function processPagination(place, data) {
	// No pagination
	if (!data.hasOwnProperty('results')) {
		place.pagination = null;
		return data;
	}

	const { results, ...pagination } = data;
	const prevPagination = place.pagination || {};

	const prevParams = parsePaginationUrl(pagination.previous);
	const nextParams = parsePaginationUrl(pagination.next);
	const pageSize = prevParams.pageSize || nextParams.pageSize || DEFAULT_PAGE_SIZE;
	const currentPage = (prevParams.page + 1) || (nextParams.page - 1) || 1;

	// If pagination is different, clean data as some might be missing with a different page size
	if (prevPagination.pageSize && prevPagination.pageSize !== pageSize) {
		place.data = {};
		place.resources = {};
		place.pagination = {};
	}

	// Update pagination in place
	const fetchedPages = (prevPagination.fetchedPages || new Set()).add(currentPage);
	place.pagination = {
		count: pagination.count,
		pageSize,
		fetchedPages,
		lastFetched: currentPage,
		nbPages: Math.ceil(pagination.count / pageSize),
	}

	return results;
}

/**
 * Get the status of the response
 */
function getStatus(payload) {
	return payload.status || (payload.response && payload.response.status);
}

/*
|---------------------------------------------------------
|		Reducer
|---------------------------------------------------------
*/

/** This reducer manages the async API operations */
export default function apiReducer(state = DEFAULT_API_STORE, action) {

	if (action.type && action.type.startsWith(API_REDUX_PREFIX)) {
		return produce(state, draft => {

			// place is the resource place where to store the data
			const { path, id } = getPathFromMeta(action.meta);
			let place = buildPathInStore(draft, path);

			const callStatus = action.type.split('_').pop();
			switch (callStatus) {

				case ASYNC_SUFFIXES.loading:
					// TODO
					place.fetching = true;
					place.status = null;
					return draft;

				case ASYNC_SUFFIXES.error:
					// if (id) // TODO test ????
					// 	place = buildPathInStore(draft, path.concat([id]));
					place.fetching = false;
					place.fetched = false;
					place.error = action.payload;
					place.failed = true;
					place.status = getStatus(action.payload);
					return draft;

				case ASYNC_SUFFIXES.success:
					// Get all data need from action
					const data = processPagination(place, action.payload.data);
					const { dataScope, dataChange, timestamp } = action.meta;

					const status = getStatus(action.payload);
					makeResourceSuccessful(place, timestamp, status);

					switch (dataScope) {
						case DATA_SCOPES.ONE:
							const dataId = id || data.id;
							changeOneElement(place, dataChange, dataId, data, timestamp, status);
							break;

						case DATA_SCOPES.FULL:
							switch (dataChange) {
								case DATA_CHANGES.ASSIGN:
									place.data = data;
									break;

								case DATA_CHANGES.REMOVE:
									// TODO Delete place ?
									delete place.data;
									delete place.resources;
									break;

								default:
									break;
							}
							break;

						case DATA_SCOPES.MULTIPLE:
							Object.values(data).forEach((element, index) => {
								const elementId = element.id || index;
								changeOneElement(place, dataChange, elementId, element, timestamp, status);
							});
							break;

						default:
							break;
					}

					return draft;

				default:
					return draft;
			}
		});
	}

	return state;
}
