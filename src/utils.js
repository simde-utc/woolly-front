import React from 'react';


/*
|---------------------------------------------------------
|		Style utils
|---------------------------------------------------------
*/

export function mergeClasses(classes, ...names) {
	return names.reduce((merged, name) => `${merged} ${classes[name]}`, '').slice(1);
}

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

export function arrayToMap(array, key) {
	if (typeof key === 'string')
		key = object => object[key];
	return array.reduce((map, object) => {
		map[key(object)] = object;
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

/*
|---------------------------------------------------------
|		Right utils
|---------------------------------------------------------
*/

export function hasManagerRights(auth, userAssos) {
	return auth.authenticated && (
		auth.user.is_admin || !isEmpty(userAssos)
	);
}
