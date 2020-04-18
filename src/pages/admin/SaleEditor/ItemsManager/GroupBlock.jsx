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
        <Box display="inline-block" mr={3} name="itemgroups" value={itemgroup.id} onClick={props.onSelect}>
            <h4>{itemgroup.name || 'Création en cours...'}</h4>
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
                                />
                            ) : (
                                <Skeleton
                                    variant="rect"
                                    width={250}
                                    height={120}
                                    // borderRadius={10}
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
