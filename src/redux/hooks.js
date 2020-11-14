import { useEffect } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useSelector, useDispatch } from 'react-redux';
import { pathToArray } from './reducers/api';
import apiActions, { APIAction, apiAxios } from './actions/api';


const USE_API_STORE_DEFAULT_OPTIONS = {
	action: 'get',
	queryParams: undefined,
	jsonData: undefined,

	raiseError: true,
	fetchingValue: undefined,
};

// HERE FIXME Process pagination
// Maybe use https://redux-saga.js.org/
export function useStoreAPIData(path, options = {}) {
	// Patch params
	path = pathToArray(path);
	options = { ...USE_API_STORE_DEFAULT_OPTIONS, ...options };
	if (options.action === 'get' && path.length % 2)
		options.action = 'all';

	// Get data from redux store
	const dispatch = useDispatch();
	const resource = useSelector(store => store.api.get(path));

	// FIXME Fires fetching multiple times
	useDeepCompareEffect(() => {
		// Fetch if not fetched
		if (!resource.fetched && !resource.fetching) {
			const action = new APIAction();
			action.path = path;
			action.uri = path.join('/');
			const actionData = action.generateAction(options.action, options.queryParams, options.jsonData);
			// console.log(actionData)
			dispatch(actionData);
		}

		// Raise error if needed
		if (resource.error && options.raiseError)
			throw Error(resource.error);
	}, [resource, path, options, dispatch]);

	if (!resource.fetched || resource.fetching)
		return options.fetchingValue;

	return resource.data;
}

// TODO Check updateOrderStatus that is used
export async function updateOrderStatus(dispatch, orderId, auto = { fetch: false, redirect: false }) {
	const resp = (await apiAxios.get(`/orders/${orderId}/status`)).data

	const fetchOrder = () => dispatch(apiActions.orders.find(orderId));
	const redirectToPayment = () => resp.redirect_url ? window.location.href = resp.redirect_url : null;

	if (auto.fetch && resp.updated)
		fetchOrder();
	if (auto.redirect && resp.redirect_url)
		redirectToPayment();

	return { resp, fetchOrder, redirectToPayment };
}

function fetchUserOrders(dispatch, userId) {
	dispatch(
		apiActions
			.defineUri(`users/${userId}/orders`)
			.definePath(['auth', 'orders'])
			.all({
				order_by: '-id',
				include: 'sale,orderlines,orderlines__item,orderlines__orderlineitems',
			})
	);
}

export function useUserOrders() {
	const dispatch = useDispatch();
	const userId = useSelector(store => store.getAuthUser('id', null));
	const orders = useSelector(store => store.getAuthRelatedData('orders', undefined));

	useEffect(() => {
		if (userId)
			fetchUserOrders(dispatch, userId);
	}, [dispatch, userId]);

	return { userId, orders, fetchOrders: () => fetchUserOrders(dispatch, userId) };
}
