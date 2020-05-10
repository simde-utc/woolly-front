import React from 'react';
import { parseISO, lightFormat, formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns'

window.__localeId__ = 'fr'

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


function goDeep(path, ...args) {
	return path ? path.split('.').reduce((dataArr, step) => (
		dataArr.map(data => data[step])
	), args) : args;
}

export function getDifferentChildren(prevData, nextData, path=null) {
	if (path)
		[prevData, nextData] = goDeep(path, prevData, nextData);
	return Object.keys(nextData).reduce((store, key) => {
		if (key in prevData)
			store[prevData[key] === nextData[key] ? 'same' : 'updated'].push(key);
		else
			store.added.push(key);
		return store;
	}, {
		added: [],
		updated: [],
		same: [],
		deleted: Object.keys(prevData).filter(key => !(key in nextData)),
	});
}

export function areDifferent(a, b, path=null) {
	if (path)
		[a, b] = goDeep(path, a, b);
	return a !== b || JSON.stringify(a) !== JSON.stringify(b);
}

export function dataToChoices(data, labelKey) {
	return Object.values(data).reduce((choices, object) => {
		choices[object.id] = {
			value: object.id,
			label: object[labelKey],
		};
		return choices;
	}, {});
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

export function formatDate(date, variant = 'date') {
	if (typeof date === 'string')
		date = parseISO(date);
	switch (variant) {
		case 'date':
			return lightFormat(date, 'dd/MM/yyyy')
		case 'datetime':
			return lightFormat(date, 'dd/MM/yyyy HH:mm')
		case 'datetimesec':
			return lightFormat(date, 'dd/MM/yyyy HH:mm:ss')
		case 'fromNow':
			return formatDistanceToNow(date);
		case 'fromNowStrict':
			return formatDistanceToNowStrict(date);
		default:
			throw Error(`Unknown format '${variant}'`)
	}
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
