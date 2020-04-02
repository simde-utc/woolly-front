import React from 'react';
import { Card, CardContent, CardActions, Button } from '@material-ui/core';
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

export function ItemCard({ item, ...props }) {
    return (
        <Card raised={props.selected} style={{ display: 'inlineBlock' }}>
            <CardContent>
                <h5>{item.name}</h5>
            </CardContent>
            <CardActions>
                <Button
                    name="items"
                    value={item.id}
                    onClick={props.handleSelect}
                    size="small"
                >
                    Modifier
                </Button>
            </CardActions>
        </Card>
    );
}

export function GroupBlock({ itemgroup, items, ...props}) {
    return (
        <React.Fragment>
            <h4>{itemgroup.name}</h4>
            <div>
                {isEmpty(itemgroup.items) ? (
                    <span>No items</span>
                ) : (
                    itemgroup.items.map(id => (
                        <ItemCard
                            key={id}
                            item={items[id]}
                            selected={props.selected === id}
                            handleSelect={props.handleSelect}
                        />
                    ))
                )}
            </div>
        </React.Fragment>
    );
}

function ItemsDisplay({ itemgroups, items, ...props }) {
    const orphanItems = Object.values(items).filter(item => item.group === null).map(item => item.id);
    const hasOrphans = !isEmpty(orphanItems);

    if (hasOrphans && isEmpty(itemgroups))
        return <div>Empty</div>;
    return (
        <div>
            {Object.values(itemgroups).map(itemgroup => (
                <GroupBlock 
                    key={itemgroup.id}
                    itemgroup={itemgroup}
                    items={items}
                    selected={props.selected}
                    handleSelect={props.handleSelect}
                />
            ))}
            {hasOrphans && (
                <GroupBlock
                    itemgroup={{ name: 'Sans groupe', items: orphanItems }}
                    items={items}
                    selected={props.selected}
                    handleSelect={props.handleSelect}
                />
            )}
        </div>
    );
}

export default ItemsDisplay;