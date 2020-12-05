import axios from "axios";
import apiActions from "redux/actions/api";
import { API_URL } from "utils/constants";
import { isEmpty } from "utils/helpers";

/**
 * Default axios for the API
 */
export const apiAxios = axios.create({
	baseURL: API_URL,
	xsrfHeaderName: "X-CSRFToken",
	xsrfCookieName: "csrftoken",
});

/**
 * Check that a user a manager rights
 */
export function hasManagerRights(auth, userAssos) {
	return auth.authenticated && (auth.user.is_admin || !isEmpty(userAssos));
}

/**
 * Helper to update the status of an order
 */
export async function updateOrderStatus(dispatch, orderId, auto = { fetch: false, redirect: false }) {
	const data = (await apiAxios.get(`/orders/${orderId}/status`)).data

	const fetchOrder = () => dispatch(apiActions.orders.find(orderId));
	const redirectToPayment = () => data.redirect_url ? window.location.href = data.redirect_url : null;

	if (auto.fetch && data.updated)
		fetchOrder();
	if (auto.redirect && data.redirect_url)
		redirectToPayment();

	return { data, fetchOrder, redirectToPayment };
}

/**
 * Helper to get Order status actions
 */
export function getStatusActions(dispatch, history) {
	return {
		updateStatus(event, id = undefined) {
			const orderId = id || event.currentTarget.getAttribute("data-order-id");
			updateOrderStatus(dispatch, orderId, { fetch: true });
		},

		download(event, id = undefined) {
			const orderId = id || event.currentTarget.getAttribute("data-order-id");
			window.open(`${API_URL}/orders/${orderId}/pdf?download`, "_blank");
		},

		modify(event, id = undefined) {
			const orderId = id || event.currentTarget.getAttribute("data-order-id");
			history.push(`/orders/${orderId}`);
		},

		pay(event, id = undefined) {
			const saleId = id || event.currentTarget.getAttribute("data-sale-id");
			history.push(`/sales/${saleId}`);
		},

		cancel(event, id = undefined) {
			const orderId = id || event.currentTarget.getAttribute("data-order-id");
			const action = apiActions.orders(orderId).delete();
			action.payload.finally(() => updateOrderStatus(dispatch, orderId, { fetch: true }));
		},
	};
};

