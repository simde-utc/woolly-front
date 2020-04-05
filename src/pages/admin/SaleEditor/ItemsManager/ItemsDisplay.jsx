import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Card, CardContent } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { isEmpty } from '../../../../utils';


/*
{
  "id": 5,
  "sale": "mega-vente",
  "is_active": true,
  "quantity": null,
  "max_per_user": null,
  "price": 0,
  "nemopay_id": null,
  "fields": []
}
*/

const priceFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

const useStyles = makeStyles(theme => ({
    item: {
        display: 'inline-block',
        flex: 1,
        minWidth: 200,
        maxWidth: 300,
        marginBottom: theme.spacing(2),
    }
}));

function isSelected(selected, resource, id) {
    return (
        selected
        && selected.resource === resource
        && selected.id === String(id)
    );
}

function displayQuantity(quantity, yesText, noText=null) {
    if (quantity)
        return <li><b>{quantity}</b> {yesText}</li>;
    else if (noText)
        return <li>{noText}</li>;
    return null;
}

export function ItemCard({ item, usertype, ...props }) {
    const classes = useStyles();
    // item._editing
    return (
        <Grid item className={classes.item}>
            <Card
                name="items"
                value={item.id}
                onClick={props.onSelect}
                raised={props.selected}
            >
                <CardContent>
                    <h5>{item.name || 'Création en cours...'}</h5>
                    <ul>
                        <li><b>{item.price ? priceFormatter.format(item.price) : 'Gratuit' }</b></li>
                        {displayQuantity(item.quantity, 'en vente', 'Quantitées illimitées')}
                        {displayQuantity(item.max_per_user, 'max par acheteur')}
                        {usertype && <li>{usertype.name}</li>}
                    </ul>
                </CardContent>
            </Card>
        </Grid>
    );
}

export function GroupBlock({ itemgroup, items, selected, ...props}) {
    return (
        <Box display="inline-block" mr={3}>
            <h4
                name="itemgroups"
                value={itemgroup.id}
                onClick={props.onSelect}
            >
                {itemgroup.name || 'Création en cours...'}
            </h4>
            <Grid container spacing={2}>
                {isEmpty(itemgroup.items) ? (
                    <span>No items</span>
                ) : (
                    itemgroup.items.map(id => (
                        items[id] ? (
                            <ItemCard
                                key={id}
                                item={items[id]}
                                usertype={props.usertypes[items[id].usertype]}
                                selected={isSelected(selected, 'items', id)}
                                onSelect={props.onSelect}
                            />
                        ) : (
                            <Grid item key={id}>
                                <Skeleton
                                    variant="rect"
                                    width={250}
                                    height={120}
                                    // borderRadius={10}
                                    style={{ borderRadius: 4 }}
                                    mb={2}
                                />
                            </Grid>
                        )
                    ))
                )}
            </Grid>
        </Box>
    );
}

export function ItemsDisplay({ itemgroups, ...props }) {
    const orphanItemIds = Object.values(props.items).filter(item => item.group === null).map(item => item.id);
    const hasOrphans = !isEmpty(orphanItemIds);

    if (hasOrphans && isEmpty(itemgroups))
        return <div>Empty</div>;
    return (
        <Box mr={-3} display="flex" flexWrap="wrap">
            {Object.values(itemgroups).map(itemgroup => (
                <GroupBlock 
                    key={itemgroup.id}
                    itemgroup={itemgroup}
                    {...props}
                />
            ))}
            {hasOrphans && (
                <GroupBlock
                    itemgroup={{ name: 'Sans groupe', items: orphanItemIds }}
                    {...props}
                />
            )}
        </Box>
    );
}

export default ItemsDisplay;
