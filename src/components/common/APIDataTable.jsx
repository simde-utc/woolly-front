import React from "react";
import PropTypes from "prop-types";
import { useStoreAPIData } from "redux/hooks";
import { processPagination, pathToArray } from "redux/reducers/api";
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from "utils/constants";

import MaterialTable from "material-table";
import {
	Add, Check, Clear, Delete, Edit, GetApp, FilterList, ArrowUpward,
	FirstPage, LastPage, NavigateNext, NavigateBefore, Search, ViewColumn
} from '@material-ui/icons';


export const MaterialTableIcons = {
	Add: Add,
	Check: Check,
	Clear: Clear,
	Delete: Delete,
	// DetailPanel: DetailPanel,
	Edit: Edit,
	Export: GetApp,
	Filter: FilterList,
	FirstPage: FirstPage,
	LastPage: LastPage,
	NextPage: NavigateNext,
	PreviousPage: NavigateBefore,
	ResetSearch: Clear,
	Search: Search,
	SortArrow: ArrowUpward,
	// ThirdStateCheck: ThirdStateCheck,
	ViewColumn: ViewColumn,
};

/*
query = {
	error: undefined,
	filters: [],
	orderBy: undefined,
	orderDirection: "",
	page: 0,
	pageSize: 5,
	search: "",
	totalCount: 12,
}
*/
// TODO Add sort, search, filtering functionalities
export function paginateResource(resource, transformData = null) {
	async function paginateData(query) {
		const page = query.page + 1;
		const shouldFetch = (
			!resource.fetched
			|| !resource.pagination
			|| query.pageSize !== resource.pagination.pageSize
			|| (resource.pagination.fetchedPages || {})[page] == null
		);

		if (shouldFetch) {
			const queryParams = { page, page_size: query.pageSize };
			const resp = await resource.fetchData(queryParams, true).payload;
			const { data, pagination } = processPagination(resp.data);
			return {
				data: transformData ? transformData(data) : data,
				page: query.page,
				totalCount: pagination ? pagination.count : data.length,
			}
		} else {
			const pagination = resource.pagination;
			const data = pagination
				? pagination.fetchedPages[page].map(id => resource.data[id])
				: resource.data;
			return {
				data: transformData ? transformData(data) : data,
				page: query.page,
				totalCount: pagination ? pagination.count : data.length,
			};
		}
	}
	return paginateData;
}

export default function APIDataTable({ path, queryParams = {}, apiOptions = {}, transformData = null, options = {}, ...props }) {
	const [pageSize, setPageSize] = React.useState(options.pageSize || DEFAULT_PAGE_SIZE);
	const _queryParams = { ...queryParams, page_size: pageSize };
	const resource = useStoreAPIData(pathToArray(path), _queryParams, apiOptions);

	return (
		<MaterialTable
			data={paginateResource(resource, transformData)}
			icons={MaterialTableIcons}
			onChangeRowsPerPage={setPageSize}
			options={{
				...options,
				pageSizeOptions: options.pageSizeOptions || PAGE_SIZES,
				pageSize,
			}}
			{...props}
		/>
	);
}

APIDataTable.propTypes = {
	path: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.array,
	]).isRequired,
	queryParams: PropTypes.object,
	apiOptions: PropTypes.object,
	transformData: PropTypes.func,
	options: PropTypes.object,
};
