import axios from "axios";
import apiActions from "redux/actions/api";
import { API_URL } from "utils/constants";
import { isEmpty } from "utils/helpers";
import { formatDistanceToNow, isBefore, intervalToDuration } from 'date-fns'

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


export function getCountdown(date) {
	const today = new Date();
	const begin = new Date(date);

	let duration = intervalToDuration({
		start: begin,
		end: today
	});
	let result = null;
	let durationSec = 0;
	if(duration.days > 0) {
		result = duration.days + "jours" ;
		durationSec += duration.days * 24 * 3600;
	}
	if(duration.hours > 0) {
		result = result + duration.hours + "h" ;
		durationSec += duration.hours * 3600;
	}
	if(duration.minutes > 0) {
		result = result + duration.minutes + "min" ;
		durationSec += duration.minutes * 60;
	}
	if(duration.seconds > 0) {
		result = result + duration.seconds + "sec " ;
		durationSec += duration.seconds;
	}

	if(durationSec > 3600)
		durationSec = 0;
	else {
		durationSec = Math.round((3600/(durationSec + 3600))*100);
	}

	return {timer: result, nbSeconds: durationSec};
}

export function saleIsOpen(sale) {
	const today = new Date();
	return isBefore(new Date(sale.begin_at), today) && isBefore(today, new Date(sale.end_at));
}
