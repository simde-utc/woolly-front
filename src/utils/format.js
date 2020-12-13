import React from "react";
import {
	parseISO,
	lightFormat,
	formatDistanceToNow,
	formatDistanceToNowStrict,
} from "date-fns";
import { fr } from "date-fns/locale";

window.__localeId__ = 'fr';


export function textOrIcon(text, Icon, displayText) {
	return displayText ? text : <Icon title={text} />
}

export function shorten(text, limit) {
	if (text?.length > limit)
		return text.slice(0, limit - 3) + "...";
	return text;
}

export function capitalFirst(text) {
	return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

export const priceFormatter = new Intl.NumberFormat("fr-FR", {
	style: "currency",
	currency: "EUR",
});

export function formatPrice(price, defaultValue = undefined) {
	if (!price || price === "0") {
		if (defaultValue !== undefined)
			return defaultValue;
		else
			price = 0;
	}
	return priceFormatter.format(price);
}

export function formatDate(date, variant = "date") {
	if (typeof date === "string") date = parseISO(date);
	const options = { locale: fr };
	switch (variant) {
		case "date":
			return lightFormat(date, "dd/MM/yyyy", options);
		case "datetime":
			return lightFormat(date, "dd/MM/yyyy HH:mm", options);
		case "datetimesec":
			return lightFormat(date, "dd/MM/yyyy HH:mm:ss", options);
		case "fromNow":
			return formatDistanceToNow(date, options);
		case "fromNowStrict":
			return formatDistanceToNowStrict(date, options);
		default:
			throw Error(`Unknown format '${variant}'`);
	}
}
