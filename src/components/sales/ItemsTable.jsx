import React from "react";
import PropTypes from "prop-types";

import {
	Box, Paper, TableContainer, Table, TableBody,
	TableRow, TableCell, TextField,
} from "@material-ui/core";
import { SkeletonTable } from "components/common/Skeletons";
import { isEmpty, groupData } from "utils/helpers";
import { formatPrice } from "utils/format";


export default function ItemsTable({ items, itemgroups, disabled, quantities, onQuantityChange, ...props }) {
	if (!items)
		return <SkeletonTable nCols={3} {...props} />;

	if (isEmpty(items)) {
		return (
			<Box textAlign="center" py={3}>
				Il n'y a aucun article en vente !
			</Box>
		);
	}

	const getTable = (subitems) => (
		<TableContainer>
			<Table {...props}>
				<TableBody>
					{Object.values(subitems).map(item => (
						<TableRow key={item.id}>
							<TableCell>{item.name}</TableCell>
							<TableCell>{formatPrice(item.price, 'Gratuit')}</TableCell>
							{quantities && (
								<TableCell>
									<TextField
										type="number"
										value={quantities[item.id] || 0}
										disabled={disabled}
										onChange={onQuantityChange}
										InputLabelProps={{ shrink: true }}
										inputProps={{
											min: 0,
											max: item.max_per_user,
											'data-item-id': String(item.id),
										}}
										style={{ marginTop: 8, marginBottom: 8 }}
										title={disabled ? "Connectez vous pour acheter" : null}
										margin="normal"
									/>
								</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);

	const itemsByGroup = groupData(items, "group");
	const oneGroup = Object.values(itemsByGroup).length === 0;
	return (
		<Box my={2}>
			{Object.keys(itemsByGroup).sort().map(groupId => (
				<div key={groupId}>
					{!(oneGroup && groupId === null) && (
						<Box clone mt={3} mb={2}>
							<h4>
								{groupId === null
									? <span style={{ textDecoration: "italic" }}>Sans groupe</span>
									: (itemgroups?.[groupId]?.name || "...")
								}
							</h4>
						</Box>
					)}
					<Paper>
						{getTable(itemsByGroup[groupId])}
					</Paper>
				</div>
			))}
		</Box>
	);
}

ItemsTable.propTypes = {
	items: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]),
	quantities: PropTypes.object,
	disabled: PropTypes.bool,
	onQuantityChange: PropTypes.func,
};

ItemsTable.defaultProps = {
	items: null,
	disabled: false,
	quantities: null,
	onQuantityChange: null,
};
