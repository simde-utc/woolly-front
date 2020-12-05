import React from "react";
import PropTypes from "prop-types";
import { Chip, Button, IconButton, CircularProgress } from "@material-ui/core";

import { ORDER_STATUS } from "utils/constants";


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
