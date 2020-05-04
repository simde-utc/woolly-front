import React from 'react';

import { Collapse, IconButton, Paper, Grid, Box, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableSortLabel } from '@material-ui/core'
import { Done, Pause, ExpandLess, ExpandMore } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { formatPrice } from '../../../utils';


export function ItemsSold({ items, ...props }) {

    if (!items)
        return <div><Skeleton /><Skeleton /></div>;

    if (Object.values(items).length === 0)
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
                    {Object.values(items).map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{item.is_active ? <Done /> : <Pause />}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{formatPrice(item.price)}</TableCell>
                            <TableCell>{item.quantity_sold} / {item.quantity ? item.quantity : <span>&infin;</span>}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export function GroupSold({ itemgroup, items, ...props }) {
    const [open, setOpen] = React.useState(true);

    const totalSold = items ? items.reduce((sum, item) => sum + item.quantity_sold, 0) : '...';
    return (
        <Box clone p={2} mb={2}>
            <Paper>
                <Grid container alignItems="center" wrap="wrap">
                    <Grid item xs>
                        <Box clone m={0}><h4>{itemgroup ? itemgroup.name : '...'}</h4></Box>
                    </Grid>
                    <Grid item>
                        <span>{totalSold}</span>
                        <IconButton size="small" onClick={() => setOpen(!open)}>
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </Grid>
                </Grid>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <ItemsSold items={items} />
                </Collapse>
            </Paper>
        </Box>
    );
}

export default function QuantitiesSold({ items, itemgroups, ...props }) {

    if (!items || !itemgroups)
        return <GroupSold />;

    const itemsByGroup = Object.values(items).reduce((groupMap, { group, ...item }) => {
        if (group in groupMap)
            groupMap[group].push(item);
        else
            groupMap[group] = [ item ];
        return groupMap;
    }, {});

    const orphans = itemsByGroup[null];
    return (
        <React.Fragment>
            {Object.values(itemgroups).map(itemgroup => (
                <GroupSold
                    key={itemgroup.id}
                    itemgroup={itemgroup}
                    items={itemsByGroup[itemgroup.id] || []}
                />
            ))}
            {orphans && orphans.length && (
                <GroupSold
                    itemgroup={{ name: 'Sans groupe' }}
                    items={orphans}
                />
            )}
        </React.Fragment>
    );
}
