import { useEffect } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useSelector, useDispatch } from 'react-redux';
import { pathToArray } from './reducers/api';
import apiActions, { APIAction, apiAxios, API_METHODS } from './actions/api';

/**
 * Hook to get data from the store using automatic API calls
 */
export function useStoreAPIData(_path, queryParams = undefined, options = {}) {
	const path = pathToArray(_path);
	const actionData = options.actionData || (
		options.singleElement ? API_METHODS.find : API_METHODS.all
	);

	// Get data from redux store
	const dispatch = useDispatch();
	const resource = useSelector(store => store.api.get(path));

	function fetchData(additionalQuery = null, returnAction = false) {
		const actionGen = new APIAction();
		actionGen.path = path;
		actionGen.uri = path.join('/');
		actionGen.idIsGiven = Boolean(options.singleElement);
		const query = additionalQuery ? { ...queryParams, ...additionalQuery } : queryParams;
		const action = actionGen.generateAction(actionData, query)
		dispatch(action);
		if (returnAction)
			return action;
	}

	// At first use or when data changes, automaticaly fire fetching
	useDeepCompareEffect(fetchData, [actionData, path, queryParams, options, dispatch]);

	return { ...resource, fetchData };
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
		apiActions.authUser(userId).orders.all({
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
