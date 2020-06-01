import React from 'react';
import MaterialTable from 'material-table';
import { useStoreAPIData } from '../../../redux/hooks';
import { VALID_ORDER_STATUS, MaterialTableIcons } from '../../../constants';
import { SkeletonTable } from '../../../components/common/Skeletons';


const queryParams = {
    filter: `order__status__in=${VALID_ORDER_STATUS.join(',')}`,
    include: 'orderlineitems__orderlinefields',
};

export default function TicketsList({ saleId, items, ...props }) {

    // orderlines or orderlineitems ?
    const orderlines = useStoreAPIData(['sales', saleId, 'orderlines' ], { queryParams })


    if (!orderlines)
        return <SkeletonTable nCols={4} />;

    // Get items names lookup
    const itemNames = items ? Object.values(items).reduce((names, item) => {
        names[item.id] = item.name;
        return names;
    }, {}) : {};

    if (!items)
        return 'items missing'

    const fieldsColumns = Object.values(items).reduce((map, item) => {
        item.fields.forEach(field => {
            if (!map.hasOwnProperty(field))
                map[field] = {
                    field: field,
                    title: field, // TODO
                };
        })
        return map;
    }, {});

    const orderlineitems = Object.values(orderlines).reduce((arr, orderline) => {
        arr.push(...orderline.orderlineitems.map(orderlineitem => ({
            ...orderlineitem,
            item: orderline.item,
            ...orderlineitem.orderlinefields.reduce((fields, orderlinefield) => {
                fields[orderlinefield.field] = orderlinefield.value;
                return fields;
            }, {}),
        })));
        return arr;
    }, []);

    window.orderlines = orderlines
    window.items = items

    return (
        <MaterialTable
            title="Billets"
            data={orderlineitems}
            columns={[
                { title: 'UUID', field: 'id' },
                { title: 'Article', field: 'item', lookup: itemNames },
                ...Object.values(fieldsColumns),
            ]}
            icons={MaterialTableIcons}
            options={{
                search: true,
            }}
        />
    );
}
