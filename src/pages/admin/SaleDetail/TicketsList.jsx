import React from "react";
import { useStoreAPIData } from "../../../redux/hooks";
import APIDataTable from "../../../components/common/APIDataTable";
import { VALID_ORDER_STATUS } from "../../../constants";
import { arrayToMap } from "../../../utils";

export default function TicketsList({ saleId, items, itemgroups, ...props }) {
	// Get all fields for the moment, shouldn't be too much
	const fields = useStoreAPIData("fields", { page_size: "max" }).data;

	// Get items and groups names lookups
	const itemNames = items ? arrayToMap(Object.values(items), "id", "name") : {};
	const itemgroupNames = items && itemgroups ? Object.values(items).reduce((acc, item) => {
		if (item.group)
			acc[item.id] = (itemgroups[item.group] || {}).name || "Inconnu";
		return acc;
	}, {}) : {};

	const fieldsColumns = (
		items && fields
			? Object.values(items).reduce((map, item) => {
					item.fields.forEach((field) => {
						if (!map.hasOwnProperty(field))
							map[field] = {
								field: field,
								title: fields[field] ? fields[field].name : field,
							};
					});
					return map;
			  }, {})
			: {}
	);

	// Patch data for table display
	function reduceOrderlines(orderlines) {
		return orderlines.reduce((arr, orderline) => {
			arr.push(
				...orderline.orderlineitems.map((orderlineitem) => ({
					...orderlineitem,
					item: orderline.item,
					...orderlineitem.orderlinefields.reduce((fields, orderlinefield) => {
						fields[orderlinefield.field] = orderlinefield.value;
						return fields;
					}, {}),
				}))
			);
			return arr;
		}, []);
	}

	return (
		<APIDataTable
			title="Billets"
			path={["sales", saleId, "orderlines"]}
			queryParams={{
				filter: `order__status__in=${VALID_ORDER_STATUS.join(",")}`,
				include: "orderlineitems__orderlinefields",
			}}
			transformData={reduceOrderlines}
			columns={[
				{ title: "UUID", field: "id" },
				{ title: "Groupe", field: "item", lookup: itemgroupNames, emptyValue: "Sans groupe" },
				{ title: "Article", field: "item", lookup: itemNames },
				...Object.values(fieldsColumns),
			]}
			options={{
				search: true,
				columnsButton: true,
				exportButton: true,
				exportAllData: true,
				exportFileName: `tickets_${saleId}_${new Date().toISOString().slice(0, 10)}`,
			}}
		/>
	);
}
