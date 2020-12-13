import React from "react";
import PropTypes from "prop-types";

import { Box, TableContainer, Table, TableBody, TableRow, TableCell, TextField } from "@material-ui/core";
import { SkeletonTable } from "components/common/Skeletons";
import { formatPrice } from "utils/format";


export default function ItemsTable({ items, disabled, quantities, onQuantityChange, ...props }) {
	// Skeleton
	if (!items)
		return <SkeletonTable nCols={3} {...props} />;

	if (Object.values(items).length === 0)
		return <Box textAlign="center" py={3}>Il n'y a aucun article en vente !</Box>;

	// TODO Group items
	return (
		<TableContainer>
			<Table {...props}>
				<TableBody>
					{Object.values(items).map(item => (
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
