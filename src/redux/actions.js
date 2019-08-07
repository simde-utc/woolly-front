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

// Set up Axios defaults
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'csrftoken';


// =============================================================
// 		Action Methods
// =============================================================

// Methods calling the API with alliases
export const API_METHODS = {
	all: {
		type: 'ALL_',
		method: 'get',
		action: 'updateAll',
	},
	find: {
		type: 'FIND_',
		method: 'get',
		action: 'update',
	},
	create: {
		type: 'CREATE_',
		method: 'post',
		action: 'insert',
	},
	update: {
		type: 'UPDATE_',
		method: 'put',
		action: 'update',
	},
	remove: {
		type: 'DELETE_',
		method: 'delete',
		action: 'delete',
	},
	delete: {
		type: 'DELETE_',
		method: 'delete',
		action: 'delete',
	},
};
API_METHODS.one = API_METHODS.find;
API_METHODS.get = API_METHODS.find;
API_METHODS.remove = API_METHODS.delete;

// Methods modifying the action
export const CONFIG_METHODS = {
	/** Define the path for the resource in the store */
	definePath: action => path => {
		action.path = path.slice();
		action.pathLocked = true;
		return new Proxy(action, actionHandler);
	},

	/** Add a valid status */
	addValidStatus: action => validStatus => {
		action.validStatus.push(validStatus);
		return new Proxy(action, actionHandler);
	},

	/** Define the valid status */
	defineValidStatus: action => validStatus => {
		action.validStatus = validStatus;
		return new Proxy(action, actionHandler);
	},

	/** Set Action options */
	setOptions: action => options => {
		action.options = { ...action.options, ...options };
		return new Proxy(action, actionHandler);
	},
};


// =============================================================
// 		Handler and RestAction class
// =============================================================

// Gestionnaire d'actions (crée dynamiquement les routes api à appeler et où stocker les données)
export const actionHandler = {
	get(action, attr) {

		// Real attribute of Action
		if (action[attr] !== undefined)
			return action[attr];

		// Methods that configure the action
		if (attr in CONFIG_METHODS)
			return CONFIG_METHODS[attr](action);

		// Build the API query method
		const apiMethod = (...args) => {
			let id, queryParams, jsonData;

			// GET query on a single element
			if (['find', 'one', 'get'].includes(attr)) {
				if (args.length > 0 || action.idIsGiven || attr === 'one') {
					if (action.idIsGiven || attr === 'one') {
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
			if (attr == 'all') {
				[queryParams, jsonData] = args;
				return action.generateAction('all', queryParams, jsonData);
			}

			// POST PUT DELETE an element
			if (['create', 'update', 'remove', 'delete'].includes(attr)) {
				if (action.idIsGiven || attr === 'create') {
					[queryParams, jsonData] = args;
				} else {
					[id, queryParams, jsonData] = args;
					action.addUri(id);
				}
				return action.generateAction(attr, queryParams, jsonData);
			}

			// Not an HTTP Method (ex: actions.users(1))
			if (args.length === 1)
				action.addId(args[0]);
			return new Proxy(action, actionHandler);
		};

		// HTTP Action (ex: actions.users.get())
		if (attr in API_METHODS)
			return apiMethod;

		// If not, callback the apiMethod and build the URI
		// Example: `actions.users` build the URI /users
		action.addUri(attr);
		action.idIsGiven = false;

		return new Proxy(apiMethod, {	get: (func, key) => func()[key] });
	},
};

// REST Action management class
export class RestAction {
	constructor(rootUri) {
		this.rootUri = rootUri || '';
		this.uri = '';
		this.idIsGiven = false;
		this.path = [];
		this.pathLocked = false;
		this.actions = API_METHODS;
		this.validStatus = [200, 201, 202, 203, 204, 416];
		this.options = {
			type: undefined,
			axios: {},
			meta: {},
			action: {},
		};

		return new Proxy(this, actionHandler);
	}

	addUri(step) {
		this.uri += `/${step}`;

		if (!this.pathLocked)
			this.path.push(step);
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
		return this.actions[action].type + this.path.join('_').toUpperCase();
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
			payload: axios.request({
				url: this.generateUri(this.rootUri + this.uri, queryParams),
				method: actionData.method,
				data: jsonData,
				withCredentials: true,
				...this.options.axios,
			}),
			...this.options.action,
		};
	}
}


// TODO
const CUSTOM_ACTIONS = {
	config: payload => ({ type: 'CONFIG', payload }),
};

/**
 * Actions are created dynamically (each use is a new RestAction instance)
 * Examples:
 *  - actions.users.all()
 *  - actions('rootUri').users(1).orders.create(null, { status: 'ok' })
 */
export const actions = new Proxy(rootUri => new RestAction(rootUri), {
	get(target, attr) {
		if (attr in CUSTOM_ACTIONS)
			return CUSTOM_ACTIONS[attr];
		return new RestAction()[attr]
	},
});

export default actions; 
