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

export const API_REDUX_PREFIX = 'API';

// Default axios for the api
export const apiAxios = axios.create({
  baseURL: API_URL,
	xsrfHeaderName: 'X-CSRFToken',
	xsrfCookieName: 'csrftoken',
});



/*
|---------------------------------------------------------
|		Action Methods
|---------------------------------------------------------
*/

// Methods calling the API with alliases
export const API_METHODS = {
	all: {
		type: 'ALL',
		method: 'get',
		action: 'updateAll',
	},
	find: {
		type: 'FIND',
		method: 'get',
		action: 'update',
	},
	create: {
		type: 'CREATE',
		method: 'post',
		action: 'insert',
	},
	update: {
		type: 'UPDATE',
		method: 'put',
		action: 'update',
	},
	remove: {
		type: 'DELETE',
		method: 'delete',
		action: 'delete',
	},
	delete: {
		type: 'DELETE',
		method: 'delete',
		action: 'delete',
	},
};
API_METHODS.get = API_METHODS.find;
API_METHODS.remove = API_METHODS.delete;

// Methods modifying the action
export const ACTION_CONFIG_METHODS = {

	/** Define the path for the resource in the store */
	definePath: action => path => {
		action.path = path.slice();
		action.pathLocked = true;
		return new Proxy(action, apiActionHandler);
	},

	/** Define the path for the resource in the store */
	defineUri: action => uri => {
		action.uri = uri;
		return new Proxy(action, apiActionHandler);
	},

	setUriFromPath: action => path => {
		action.path = path.slice();
		action.uri = path.join('/');
		action.idIsGiven = path.length % 2 === 0;
		return new Proxy(action, apiActionHandler);
	},

	/** Add a valid status */
	addValidStatus: action => validStatus => {
		action.validStatus.push(validStatus);
		return new Proxy(action, apiActionHandler);
	},

	/** Define the valid status */
	defineValidStatus: action => validStatus => {
		action.validStatus = validStatus;
		return new Proxy(action, apiActionHandler);
	},

	/** Set Action options */
	setOptions: action => options => {
		action.options = { ...action.options, ...options };
		return new Proxy(action, apiActionHandler);
	},


	// TODO Custom methods
	auth: action => (authId = null) => {
		action.path = ['auth'];
		action.uri = authId ? `/users/${authId}` : 'auth/me';
		return new Proxy(action, apiActionHandler);
	},
};

/*
|---------------------------------------------------------
|		Proxy Handler
|---------------------------------------------------------
*/

// Gestionnaire d'actions (crée dynamiquement les routes api à appeler et où stocker les données)
export const apiActionHandler = {
	get(action, attr) {
		// Access instance
		if (attr === '_instance')
			return action;

		// Real attribute of Action
		if (action[attr] !== undefined)
			return action[attr];

		// Methods that configure the action
		if (attr in ACTION_CONFIG_METHODS)
			return ACTION_CONFIG_METHODS[attr](action);

		// Build the API query method
		const apiMethod = (...args) => {
			let id, queryParams, jsonData;

			// GET query on a single element
			if (['find', 'get'].includes(attr)) {
				if (args.length > 0 || action.idIsGiven) {
					if (action.idIsGiven) {
						[queryParams, jsonData] = args;
					} else {
						[id, queryParams, jsonData] = args;
						action.addId(id);
					}
					return action.generateAction('get', queryParams, jsonData);
				}
				// ID not specified, fallback to all
				return action.generateAction('all');
			}

			// GET on multiple elements
			if (attr === 'all') {
				[queryParams, jsonData] = args;
				return action.generateAction('all', queryParams, jsonData);
			}

			// POST PUT DELETE an element
			if (['create', 'update', 'remove', 'delete'].includes(attr)) {
				if (action.idIsGiven || attr === 'create') {
					[queryParams, jsonData] = args;
				} else {
					[id, queryParams, jsonData] = args;
					action.addId(id);
				}
				return action.generateAction(attr, queryParams, jsonData);
			}

			// Not an HTTP Method (ex: actions.users(1))
			if (args.length === 1)
				action.addId(args[0]);
			return new Proxy(action, apiActionHandler);
		};

		// HTTP Action (ex: actions.users.get())
		if (attr in API_METHODS)
			return apiMethod;

		// If not, callback the apiMethod and build the URI
		// Example: `actions.users` build the URI /users
		action.addUri(attr);

		return new Proxy(apiMethod, { get: (func, key) => func()[key] });
	},
};

/*
|---------------------------------------------------------
|		API Action generator
|---------------------------------------------------------
*/

export class APIAction {
	constructor(axios_instance = apiAxios) {
		this.axios = axios_instance;
		this.uri = '';
		this.idIsGiven = false;
		this.path = [];
		this.pathLocked = false;
		this.actions = API_METHODS;
		this.validStatus = [200, 201, 202, 203, 204];
		this.options = {
			type: undefined,
			axios: {},
			meta: {},
			action: {},
		};

		return new Proxy(this, apiActionHandler);
	}

	addUri(step) {
		this.uri += `/${step}`;

		if (!this.pathLocked) {
			this.path.push(step);
			this.idIsGiven = false;
		}
	}

	addId(id) {
		this.uri += `/${id}`;

		if (!this.pathLocked) {
			this.path.push(id);
			this.idIsGiven = true;
		}
	}

	generateQueries(queryParams, prefix) {
		const queries = [];

		for (const key in queryParams) {
			if (queryParams.hasOwnProperty(key)) {
				const value = queryParams[key];

				if (value !== undefined) {
					if (Object.is(value))
						queries.push(this.generateQueries(value, true));
					else
						queries.push(
							`${encodeURIComponent(prefix ? `[${key}]` : key)}=${encodeURIComponent(value)}`
						);
				}
			}
		}
		return queries.join('&');
	}

	generateUri(uri, queryParams) {
		const queries = this.generateQueries(queryParams);
		return uri + (queries.length === 0 ? '' : `?${queries}`);
	}

	generateType(action) {
		return [ API_REDUX_PREFIX, this.actions[action].type, ...this.path ].join('_').toUpperCase();
	}

	generateAction(action, queryParams = {}, jsonData = {}) {
		const actionData = this.actions[action];
		return {
			type: this.options.type || this.generateType(action),
			meta: {
				action: actionData.action,
				validStatus: this.validStatus,
				path: this.path,
				timestamp: Date.now(),
				...this.options.meta,
			},
			payload: this.axios.request({
				url: this.generateUri(this.uri, queryParams),
				method: actionData.method,
				data: jsonData,
				withCredentials: true,
				...this.options.axios,
			}),
			...this.options.action,
		};
	}
}

/**
 * Actions are created dynamically (each use returns a new APIAction instance)
 * Examples:
 *  - actions.users.all()
 *  - actions.users(1).orders.create(null, { status: 'ok' })
 */
export const actions = new Proxy(axios_instance => new APIAction(axios_instance), {
	get(target, attr) {
		return new APIAction()[attr];
	},
});

export default actions;
