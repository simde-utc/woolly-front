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
