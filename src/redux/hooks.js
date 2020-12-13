import useDeepCompareEffect from "use-deep-compare-effect";
import { useSelector, useDispatch } from "react-redux";
import { pathToArray } from "./reducers/api";
import { APIAction, API_METHODS } from "./actions/api";

/**
 * Hook to get data from the store using automatic API calls
 */
export function useStoreAPIData(_path, queryParams = undefined, options = {}) {
	const path = pathToArray(_path);
	const actionData = options.actionData || (
		options.singleElement ? API_METHODS.find : API_METHODS.all
	);

	// Get data from redux store
	const dispatch = useDispatch();
	const resource = useSelector(store => store.api.get(path));

	function fetchData(additionalQuery = null, returnAction = false) {
		const actionGen = new APIAction();
		actionGen.path = path;
		actionGen.uri = options.uri || path.join("/");
		actionGen.idIsGiven = Boolean(options.singleElement);
		const query = additionalQuery ? { ...queryParams, ...additionalQuery } : queryParams;
		const action = actionGen.generateAction(actionData, query)
		dispatch(action);
		if (returnAction)
			return action;
	}

	// At first use or when data changes, automaticaly fire fetching
	useDeepCompareEffect(fetchData, [actionData, path, queryParams, options, dispatch]);

	return { ...resource, fetchData };
}
