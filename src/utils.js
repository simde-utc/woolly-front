import React from 'react';


/*
|---------------------------------------------------------
|		Object utils
|---------------------------------------------------------
*/

export function isList(object) {
	return object && object.length !== undefined;
}

export function isEmpty(object) {
	return object == null || (object instanceof Object && Object.keys(object).length === 0);
}

export function deepcopy(object) {
	return JSON.parse(JSON.stringify(object));
}

export function arrayToMap(array, getKey) {
	if (typeof getKey === 'string') {
		const key = getKey;
		getKey = obj => obj[key];
	}
	return array.reduce((map, obj) => {
		map[getKey(obj)] = obj;
		return map;
	}, {});
}

export function areDifferent(a, b, path) {
	let steps = path.split('.');
	const lastStep = steps.pop();
	for (const step of steps) {
		if (!a.hasOwnProperty(step) || !b.hasOwnProperty(step))
			return false;
		a = a[step];
		b = b[step];
	}
	return a[lastStep] !== b[lastStep];
}

export function dataToChoices(data, labelKey) {
	return Object.values(data).map(object => ({
		value: object.id,
		label: object[labelKey],
	}));
}

/*
|---------------------------------------------------------
|		Text utils
|---------------------------------------------------------
*/

export function shorten(text, limit) {
	if (text && text.length > limit)
		return text.slice(0,limit-3) + '...';
	return text;
}

export function capitalFirst(text) {
	return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

export function textOrIcon(text, Icon, displayText) {
	return displayText ? text : <Icon title={text} />
}

export const priceFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export function formatPrice(price, defaultValue = undefined) {
	if (!price || price === '0') {
		if (defaultValue !== undefined)
			return defaultValue;
		else
			price = 0;
	}
	return priceFormatter.format(price);
}

/*
|---------------------------------------------------------
|		Rights utils
|---------------------------------------------------------
*/

export function hasManagerRights(auth, userAssos) {
	return auth.authenticated && (
		auth.user.is_admin || !isEmpty(userAssos)
	);
}
