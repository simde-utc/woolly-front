import React from 'react';
import PropTypes from 'prop-types';

import { Skeleton } from '@material-ui/lab';
import {
    List, ListItem, ListItemText, ListItemSecondaryAction,
    TableContainer, Table, TableBody, TableRow, TableCell,
} from '@material-ui/core/';


function range(n) {
    return [...Array(n).keys()]
}

export function SkeletonList({ nRows, withSecondary, withAction, ...props }) {
    return (
        <List {...props}>
            {range(nRows).map(i => (
                <ListItem key={i}>
                    <ListItemText
                        primary={(
                            <Skeleton variant="text" style={{ width: withAction ? '90%' : '100%' }} />
                        )}
                        secondary={(withSecondary
                            ? <Skeleton variant="text" style={{ width: withAction ? '70%' : '80%' }} />
                            : null
                        )}
                    />
                    {withAction && (
                        <ListItemSecondaryAction>
                            <Skeleton variant="circle" width={30} height={30} />
                        </ListItemSecondaryAction>
                    )}
                </ListItem>
            ))}
        </List>
    );
}

SkeletonList.propTypes = {
    nRows: PropTypes.number,
    withSecondary: PropTypes.bool,
    withAction: PropTypes.bool,
};

SkeletonList.defaultProps = {
    nRows: 3,
    withSecondary: false,
    withAction: false,
};


export function SkeletonTable({ nRows, nCols, ...props }) {
    return (
        <TableContainer>
            <Table {...props}>
                <TableBody>
                    {range(nRows).map(i => (
                        <TableRow key={i}>
                            {range(nCols).map(j => (
                                <TableCell key={j}>
                                    <Skeleton variant="text" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

SkeletonTable.propTypes = {
    nRows: PropTypes.number,
    nCols: PropTypes.number,
};

SkeletonTable.defaultProps = {
    nRows: 3,
    nCols: 2,
};
