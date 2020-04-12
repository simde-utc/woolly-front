import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Paper, Grid, Card, CardContent } from '@material-ui/core';
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

const useItemsStyles = makeStyles(theme => ({
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

function isEditing(editing, resource, id) {
    return editing[resource][id];
}

function displayQuantity(quantity, yesText, noText=null) {
    if (quantity)
        return <li><b>{quantity}</b> {yesText}</li>;
    else if (noText)
        return <li>{noText}</li>;
    return null;
}

function NoItems({ group, ...props}) {
    const Title = group ? 'h5' : 'h4';
    return (
        <Box clone p={2} textAlign="center">
            <Paper variant="outlined" style={{ borderStyle: 'dashed' }}>
                <Title>Aucun article !</Title>
                <p>
                    {group ? (
                        group._isNew
                            ? "Ajoutez en après avoir sauvegarder le groupe"
                            : "Ajoutez en !"
                    ) : (
                        "Ajouter des groupes et articles avec les boutons ci-dessous"
                    )}
                </p>
            </Paper>
        </Box>
    );
}

export function ItemCard({ item, usertype, ...props }) {
    // item._editing
    return (
        <Box clone border={2} borderColor={props.editing ? 'yellow' : 'transparent'}>
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
        </Box>
    );
}

export function GroupBlock({ itemgroup, items, selected, editing, ...props}) {
    const classes = useItemsStyles();
    return (
        <Box
            display="inline-block"
            mr={3}
            border={2}
            borderColor={isEditing(editing, 'itemgroups', itemgroup.id) ? 'yellow' : 'transparent'}
        >
            <h4
                name="itemgroups"
                value={itemgroup.id}
                onClick={props.onSelect}
            >
                {itemgroup.name || 'Création en cours...'}
            </h4>
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
                                    editing={isEditing(editing, 'items', id)}
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

export function ItemsDisplay({ itemgroups, ...props }) {
    const orphanItemIds = Object.values(props.items).filter(item => item.group === null).map(item => item.id);
    const hasOrphans = !isEmpty(orphanItemIds);

    if (!hasOrphans && isEmpty(itemgroups))
        return <NoItems />;

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
