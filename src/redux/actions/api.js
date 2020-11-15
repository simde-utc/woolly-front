/**
 * Création et gestion automatique des actions que l'on dispatch via redux
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Alexandre Brasseur
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license GNU GPL-3.0
 */
import axios from 'axios';
import { API_URL } from '../../constants';
import { isObject } from '../../utils';

import { API_REDUX_PREFIX, DATA_CHANGES, DATA_SCOPES } from '../constants';

// TODO API AXIOS Where to put ?
/**
 * Default axios for the Woolly API
 */
export const apiAxios = axios.create({
  baseURL: API_URL,
	xsrfHeaderName: 'X-CSRFToken',
	xsrfCookieName: 'csrftoken',
});

/**
 * Methods calling the API with alliases
 */
export const API_METHODS = {
	all: {
		type: 'ALL',
		httpMethod: 'get',
		dataChange: DATA_CHANGES.ASSIGN,
		dataScope: DATA_SCOPES.MULTIPLE,
		takesId: false,
	},
	find: {
		type: 'FIND',
		httpMethod: 'get',
		dataChange: DATA_CHANGES.ASSIGN,
		dataScope: DATA_SCOPES.ONE,
		takesId: true,
	},
	create: {
		type: 'CREATE',
		httpMethod: 'post',
		dataChange: DATA_CHANGES.ASSIGN,
		dataScope: DATA_SCOPES.ONE,
		takesId: false,
	},
	update: {
		type: 'UPDATE',
		httpMethod: 'put',
		dataChange: DATA_CHANGES.ASSIGN,
		dataScope: DATA_SCOPES.ONE,
		takesId: true,
	},
	delete: {
		type: 'DELETE',
		httpMethod: 'delete',
		dataChange: DATA_CHANGES.REMOVE,
		dataScope: DATA_SCOPES.ONE,
		takesId: true,
	},
	get: {
		type: 'GET',
		httpMethod: 'get',
		dataChange: DATA_CHANGES.ASSIGN,
		dataScope: DATA_SCOPES.FULL,
		takesId: false,
	},
};

/**
 * Shortcuts and helpers to the API Action
 */
export const apiShortcuts = {
	/**
	 * Get information about the specified or authenticated user
	 */
	authUser: action => {
		function addAuthPath(userId = null, skipUri = false) {
			if (action.path.length)
				console.warning(`actions.api.authUser should be called first, path is ${action.path}`)

			action.path = ['auth'];
			if (!skipUri)
				action.uri = userId != null ? `/users/${userId}` : 'auth/me';
			return new Proxy(action, apiActionHandler);
		}
		return new Proxy(addAuthPath, { get: (func, key) => func()[key] });
	},
};

/**
 * Action handler that dynamically creates the URI path to the resource
 */
export const apiActionHandler = {
	get(action, attr) {
		// Access instance
		if (attr === '_instance')
			return action;

		// Access a real attribute of this Action
		if (action[attr] !== undefined)
			return action[attr];

		if (attr in apiShortcuts)
			return apiShortcuts[attr](action);

		// HTTP Action (ex: `actions.api.users.all()`)
		if (attr in API_METHODS) {
			return function (...args) {
				const methodData = API_METHODS[attr];
				// TODO { id, query, data } ??

				let id, queryParams, jsonData;
				if (methodData.takesId)
					[id, queryParams, jsonData] = args;
				else
					[queryParams, jsonData] = args;

				if (id != null && !action.idIsGiven)
						action.addId(id);

				return action.generateAction(methodData, queryParams, jsonData);
			}
		}

		// At this point, we dynamically build the URI
		// Example: `actions.api.users` build the URI /users
		action.addUri(attr);

		// Next we return a Proxy on a function
		// that will be used to specify a resource id
		// Example: `actions.api.users(1)`
		// If it is not called, we will access the Action with a Proxy anyway
		function resourceSpecifier(id) {
			if (id != null)
				action.addId(id);
			return new Proxy(action, apiActionHandler);
		}

		return new Proxy(resourceSpecifier, { get: (func, key) => func()[key] });
	},
};

/**
 * API Action generator
 */
export class APIAction {
	constructor(axiosInstance = apiAxios) {
		this.axios = axiosInstance;
		this.uri = '';
		this.idIsGiven = false;
		this.path = [];
		this.pathLocked = false;
		this.options = {
			type: undefined,
			axios: {},
			meta: {},
		};

		return new Proxy(this, apiActionHandler);
	}

	configure(modify) {
		modify(this);
		return new Proxy(this, apiActionHandler);
	}

	addUri(step) {
		this.uri += `/${step}`;
		this.idIsGiven = false;

		if (!this.pathLocked)
			this.path.push(step);
	}

	addId(id) {
		this.uri += `/${id}`;
		this.idIsGiven = true;

		if (!this.pathLocked)
			this.path.push(id);
	}

	/**
	 * Transform an object into a queryParams string recursively if needed
	 * @param  {Object}  queryParams The object to stringify
	 * @param  {Boolean} prefix      Used when processing recursively
	 * @return {String}              The queryParams string
	 */
	stringifyQueryParams(queryParams, prefix=undefined) {
		const queries = [];

		for (const key in queryParams) {
			if (queryParams.hasOwnProperty(key)) {
				const value = queryParams[key];

				if (value !== undefined) {
					const _key = encodeURIComponent(key);
					const prefixedKey = prefix ? `${prefix}[${_key}]` : _key;
					if (isObject(value))
						queries.push(this.stringifyQueryParams(value, prefixedKey));
					else
						queries.push(`${prefixedKey}=${encodeURIComponent(value)}`);
				}
			}
		}
		return queries.join('&');
	}

	generateUri(uri, queryParams = {}) {
		const queries = this.stringifyQueryParams(queryParams);
		return uri + (queries.length > 0 ? `?${queries}`: '');
	}

	generateType(methodType) {
		return [ API_REDUX_PREFIX, methodType, ...this.path ].join('_').toUpperCase();
	}

	generateAction(methodData, queryParams = {}, jsonData = {}) {
		return {
			type: this.options.type || this.generateType(methodData.type),
			meta: {
				path: this.path,
				idIsGiven: this.idIsGiven,
				dataChange: methodData.dataChange,
				dataScope: methodData.dataScope,
				timestamp: Date.now(),
				...this.options.meta,
			},
			payload: this.axios.request({
				url: this.generateUri(this.uri, queryParams),
				method: methodData.httpMethod,
				data: jsonData,
				withCredentials: true,
				...this.options.axios,
			}),
		};
	}
}

/**
 * Actions are created dynamically (each use returns a new APIAction instance)
 * Examples:
 *  - actions.api.users.all()
 *  - actions.api.users(1).orders.create(null, { status: 'ok' })
 */
const actions = new Proxy(axiosInstance => new APIAction(axiosInstance), {
	get(target, attr) {
		// If the axiosInstance is not specified through the call, we use the default one
		return new APIAction()[attr];
	},
});

export default actions;
