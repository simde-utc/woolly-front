import React from 'react';

import {
    Box, Grid, Collapse, Paper, IconButton, TableContainer,
    Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel,
 } from '@material-ui/core'
// import { Done, Pause, ExpandLess, ExpandMore } from '@material-ui/icons';
// import { Skeleton } from '@material-ui/lab';

export function OrderDetail({ order, ...props }) {
    return null;
}


export default function OrdersList({ orders, items, ...props }) {

    if (!orders)
        return null

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Acheteur</TableCell>
                        <TableCell>Article</TableCell>
                        <TableCell>Quantitées</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(orders).map(order => (
                        order.orderlines.map(orderline => (
                            <React.Fragment key={[order.id, orderline.id]}>
                                <TableRow>
                                    <TableCell>{order.owner && (`${order.owner.first_name} ${order.owner.last_name}`)}</TableCell>
                                    <TableCell>{items && items[orderline.item] ? items[orderline.item].name : '...'}</TableCell>
                                    <TableCell>{orderline.quantity}</TableCell>
                                </TableRow>
                                {orderline.orderlineitems.map(orderlineitem => (
                                    <TableRow key={orderlineitem.id}>
                                        <TableCell>{orderlineitem.id}</TableCell>
                                        {orderlineitem.orderlinefields.map(field => (
                                            <TableCell key={field.id}>
                                                {field.name}: {field.value}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
