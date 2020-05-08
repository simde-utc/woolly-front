import useDeepCompareEffect from 'use-deep-compare-effect';
import { useSelector, useDispatch } from 'react-redux';
import { pathToArray } from './store';
import { APIAction } from './actions';


const USE_API_STORE_DEFAULT_OPTIONS = {
	action: 'get',
	queryParams: undefined,
	jsonData: undefined,

	raiseError: true,
	fetchingValue: undefined,
};

export function useStoreAPIData(path, options = {}) {
	// Patch params
	path = pathToArray(path);
	options = { ...USE_API_STORE_DEFAULT_OPTIONS, ...options };
	if (options.action === 'get' && path.length % 2)
		options.action = 'all';

	// Get data from redux store
	const dispatch = useDispatch();
	const resource = useSelector(store => store.get(path));

	// FIXME Fires fetching multiple times
	useDeepCompareEffect(() => {
		// Fetch if not fetched
		if (!resource.fetched && !resource.fetching) {
			const action = new APIAction();
			action.path = path;
			action.uri = path.join('/');
			const actionData = action.generateAction(options.action, options.queryParams, options.jsonData);
			// console.log(actionData)
			dispatch(actionData);
		}

		// Raise error if needed
		if (resource.error && options.raiseError)
			throw Error(resource.error);
	}, [resource, path, options, dispatch]);

	if (!resource.fetched)
		return options.fetchingValue;

	return resource.data;
}
