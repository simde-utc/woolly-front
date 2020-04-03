import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Box, Grid, Card, CardContent, CardActions, Button,
} from '@material-ui/core';
import { isEmpty } from '../../../utils';

/*
{
  "id": 5,
  "sale": "mega-vente",
  "group": null,
  "usertype": "exterieur",
  "quantity_left": null,
  "name": "azdazd",
  "description": "",
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
                onClick={props.handleSelect}
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
        <div>
            <h4
                name="itemgroups"
                value={itemgroup.id}
                onClick={props.handleSelect}
            >
                {itemgroup.name}
            </h4>
            <Grid container spacing={2}>
                {isEmpty(itemgroup.items) ? (
                    <span>No items</span>
                ) : (
                    itemgroup.items.map(id => (
                        <ItemCard
                            key={id}
                            item={items[id]}
                            usertype={props.usertypes[items[id].usertype]}
                            selected={isSelected(selected, 'items', id)}
                            handleSelect={props.handleSelect}
                        />
                    ))
                )}
            </Grid>
        </div>
    );
}

function ItemsDisplay({ itemgroups, ...props }) {
    const orphanItems = Object.values(props.items).filter(item => item.group === null).map(item => item.id);
    const hasOrphans = !isEmpty(orphanItems);

    if (hasOrphans && isEmpty(itemgroups))
        return <div>Empty</div>;
    return (
        <div>
            {Object.values(itemgroups).map(itemgroup => (
                <GroupBlock 
                    key={itemgroup.id}
                    itemgroup={itemgroup}
                    {...props}
                />
            ))}
            {hasOrphans && (
                <GroupBlock
                    itemgroup={{ name: 'Sans groupe', items: orphanItems }}
                    {...props}
                />
            )}
        </div>
    );
}

export default ItemsDisplay;