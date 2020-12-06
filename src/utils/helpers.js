
export function isObject(object) {
	return typeof object === 'object' && object !== null && !isList(object);
}

export function isList(object) {
	return object && object.length !== undefined;
}

export function isEmpty(object) {
	return object == null || (object instanceof Object && Object.keys(object).length === 0);
}

export function deepcopy(object) {
	return JSON.parse(JSON.stringify(object));
}

// -------------------------------------------------
//    Mappers
// -------------------------------------------------

export function stringToGetter(attr) {
	return obj => obj[attr];
}

export function arrayToMap(array, getKey, getValue) {
	if (typeof getKey === 'string')
		getKey = stringToGetter(getKey);
	if (typeof getValue === 'string')
		getValue = stringToGetter(getValue);

	return array.reduce((map, obj) => {
		map[getKey(obj)] = getValue ? getValue(obj) : obj;
		return map;
	}, {});
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

export function groupData(data, getKey) {
	if (typeof getKey === 'string')
		getKey = stringToGetter(getKey);
	return Object.values(data).reduce((groupMap, object) => {
		const group = getKey(object);
		if (group in groupMap)
			groupMap[group].push(object);
		else
			groupMap[group] = [object];
		return groupMap;
	}, {});
}


// -------------------------------------------------
//    Comparison
// -------------------------------------------------

export function goDeep(path, ...args) {
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
