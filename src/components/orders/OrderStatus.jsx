import React from "react";
import PropTypes from "prop-types";
import apiActions, { apiAxios } from "../../redux/actions/api";
import { ORDER_STATUS, API_URL } from "../../constants";

import { Chip, Button, IconButton, CircularProgress } from "@material-ui/core";


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


export function OrderStatusButton({ status, updateStatus, variant, updating, ...props }) {
	if (typeof status === "number")
		status = ORDER_STATUS[status] || {};

	const Component = {
		chip: Chip,
		button: Button,
		text: "span",
	}[variant];

	let _props = {
		onClick: updateStatus,
		...props,
		style: {
			backgroundColor: variant === "chip" ? status?.color : undefined,
			color: variant === "chip" ? "#fff" : status?.color,
			cursor: updateStatus ? "pointer" : null,
			...props.style,
		},
		[variant === "chip" ? "label" : "children"]: status?.label || "Inconnu",
	};

	const icon = updating ? <CircularProgress size="1em" style={{ color: 'inherit' }} /> : null;
	if (variant === "chip") {
		_props.icon = icon;
		_props.clickable = Boolean(updateStatus);
	}	else if (variant === "button") {
		_props.startIcon = icon;
	}

	return <Component {..._props} />;
}

OrderStatusButton.propTypes = {
	status: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.number,
	]).isRequired,
	variant: PropTypes.oneOf(["button", "chip", "text"]),
	updateStatus: PropTypes.func,
	updating: PropTypes.bool,
};

OrderStatusButton.defaultProps = {
	variant: "text",
};


export function OrderActionButton({ order, text, Icon, onClick, ...props }) {
	return (
		<IconButton
			size="small"
			title={text}
			onClick={onClick}
			data-order-id={order.id}
			data-sale-id={order.sale?.id}
		>
			<Icon title={text} />
		</IconButton>
	);
}

OrderActionButton.propTypes = {
	order: PropTypes.object.isRequired,
	text: PropTypes.string.isRequired,
	Icon: PropTypes.object.isRequired,
	onClick: PropTypes.func.isRequired,
};
