import React from "react";

import {
	Box, Grid, Collapse, Paper, IconButton,
	TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
} from "@material-ui/core";
import { Done, Pause, ExpandLess, ExpandMore } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import Stat from "components/common/Stat";

import { formatPrice } from "utils/format";
import { isEmpty } from "utils/helpers";


const quantitySold = (items, defaultValue = "?") => (
	items ? Object.values(items).reduce((sum, item) => (
		sum + (item?.quantity_sold || 0)
	), 0) : defaultValue
);

const priceSold = (items, defaultValue = "?") => (
	items ? Object.values(items).reduce((sum, item) => (
		sum + ((item?.quantity_sold || 0) * (item?.price || 0))
	), 0) : defaultValue
);

export function ItemsSold({ items, ...props }) {
	if (!items)
		return <div><Skeleton /><Skeleton /></div>;

	if (isEmpty(items))
		return <Box textAlign="center" disabled>Pas d'article</Box>;

	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Actif</TableCell>
						<TableCell>Item</TableCell>
						<TableCell>Prix</TableCell>
						<TableCell>Quantitées</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.values(items).map((item) => (
						<TableRow key={item.id}>
							<TableCell>{item.is_active ? <Done /> : <Pause />}</TableCell>
							<TableCell>{item.name}</TableCell>
							<TableCell>{formatPrice(item.price)}</TableCell>
							<TableCell>
								{item?.quantity_sold || 0}
								&nbsp;/&nbsp;
								{item?.quantity || <span>&infin;</span>}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export function GroupSold({ itemgroup, items, ...props }) {
	const [open, setOpen] = React.useState(true);
	return (
		<Box clone p={2} mb={2}>
			<Paper>
				<Grid container alignItems="center" wrap="wrap">
					<Grid item xs>
						<Box clone m={0}>
							<h4>{itemgroup?.name || "..."}</h4>
						</Box>
					</Grid>
					<Grid item>
						<span>{quantitySold(items)}/{itemgroup?.quantity || <span>&infin;</span>}</span>
						<IconButton size="small" onClick={() => setOpen(!open)}>
							{open ? <ExpandLess /> : <ExpandMore />}
						</IconButton>
					</Grid>
				</Grid>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<Box py={2}>
						<ItemsSold items={items} />
					</Box>
				</Collapse>
			</Paper>
		</Box>
	);
}

export default function QuantitiesSold({ items, itemgroups, fetched, max_item_quantity, ...props }) {
	if (!fetched)
		return <GroupSold />;

	if (isEmpty(items)) {
		return (
			<Box my={3} p={3} textAlign="center" boxShadow={3} borderRadius={5}>
				Aucun article
			</Box>
		);
	}

	const itemsByGroup = Object.values(items).reduce((groupMap, { group, ...item }) => {
		if (group in groupMap)
			groupMap[group].push(item);
		else
			groupMap[group] = [item];
		return groupMap;
	}, {});

	const orphans = itemsByGroup[null];
	return (
		<React.Fragment>
			<Box display="flex" justifyContent="space-evenly" mt={2} mb={4}>
				<Stat title="Articles vendus" value={quantitySold(items)} max={max_item_quantity} />
				<Stat title="Argent récolté" value={priceSold(items)} unit="€" />
			</Box>
			{Object.values(itemgroups).map((itemgroup) => (
				<GroupSold
					key={itemgroup.id}
					itemgroup={itemgroup}
					items={itemsByGroup[itemgroup.id] || []}
				/>
			))}
			{orphans?.length && (
				<GroupSold itemgroup={{ name: "Sans groupe" }} items={orphans} />
			)}
		</React.Fragment>
	);
}
