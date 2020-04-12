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
        >
            <CardContent>
                <h5>{item.name || 'Création en cours...'}</h5>
                <ul>
                    <li><b>{formatPrice(item.price, 'Gratuit')}</b></li>
                    {displayQuantity(item.quantity, 'en vente', 'Quantitées illimitées')}
                    {displayQuantity(item.max_per_user, 'max par acheteur')}
                    {usertype && <li>{usertype.name}</li>}
                </ul>
            </CardContent>
        </Card>
    );
}
