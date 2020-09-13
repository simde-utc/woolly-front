import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { isEmpty } from '../../../../utils';

import NoItems from './NoItems';
import ItemCard from './ItemCard';


function isSelected(selected, resource, id) {
    return (
        selected
        && selected.resource === resource
        && selected.id === String(id)
    );
}

const useStyles = makeStyles(theme => ({
    group: {
        display: 'inline-block',
        marginRight: theme.spacing(3),
    },
    item: {
        display: 'inline-block',
        flex: 1,
        minWidth: 200,
        maxWidth: 300,
        marginBottom: theme.spacing(2),
    }
}));


export default function GroupBlock({ itemgroup, items, selected, editing, ...props}) {
    const classes = useStyles();
    return (
        <Box
            className={classes.group}
            name="itemgroups" value={itemgroup.id}
            onClick={props.onSelect}
        >
            <h4>{itemgroup.name || 'Veuillez choisir un nom'}</h4>
            <Grid container spacing={2}>
                {isEmpty(itemgroup.items) ? (
                    <Grid item className={classes.item}>
                        <NoItems group={itemgroup} />
                    </Grid>
                ) : (
                    itemgroup.items.map(id => (
                        <Grid item key={id} className={classes.item}>
                            {items[id] ? (
                                <ItemCard
                                    key={id}
                                    item={items[id]}
                                    usertype={props.usertypes[items[id].usertype]}
                                    selected={isSelected(selected, 'items', id)}
                                    editing={editing['items'][id]}
                                    onSelect={props.onSelect}
                                    hasErrors={!isEmpty(props.errors['items'][id])}
                                />
                            ) : (
                                <Skeleton
                                    variant="rect"
                                    width={250}
                                    height={120}
                                    style={{ borderRadius: 4 }}
                                />
                            )}
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
}
