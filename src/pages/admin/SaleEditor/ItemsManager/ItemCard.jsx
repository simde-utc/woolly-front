import React from 'react';
import { Card, CardContent } from '@material-ui/core';

import { formatPrice } from '../../../../utils';

function displayQuantity(quantity, yesText, noText = null) {
    if (quantity)
        return <li><b>{quantity}</b> {yesText}</li>;
    else if (noText)
        return <li>{noText}</li>;
    return null;
}


export default function ItemCard({ item, usertype, ...props }) {
    return (
        <Card
            name="items"
            value={item.id}
            onClick={props.onSelect}
            raised={props.selected}
            style={{
                borderColor: props.hasErrors ? 'red': 'transparent',
                borderStyle: 'solid',
                borderWidth: 1,
            }}
        >
            <CardContent style={{ padding: '4px 16px' }}>
                <h4>{item.name || 'Création en cours...'}</h4>
                <ul>
                    <li><b>{formatPrice(item.price, 'Gratuit')}</b></li>
                    {displayQuantity(item.quantity, 'en vente', 'Quantitées illimitées')}
                    {displayQuantity(item.max_per_user, 'max par acheteur')}
                    {usertype && <li>{usertype.name}</li>}
                    {displayQuantity(item.itemfields.length, 'champs', 'Aucun champ')}
                </ul>
            </CardContent>
        </Card>
    );
}
