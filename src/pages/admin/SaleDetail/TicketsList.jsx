import React from 'react';
import MaterialTable from 'material-table';
import { SkeletonTable } from '../../../components/common/Skeletons';
import { useStoreAPIData } from '../../../redux/hooks';
import { VALID_ORDER_STATUS, MaterialTableIcons } from '../../../constants';
import { arrayToMap } from '../../../utils';


const queryParams = {
    filter: `order__status__in=${VALID_ORDER_STATUS.join(',')}`,
    include: 'orderlineitems__orderlinefields',
};

export default function TicketsList({ saleId, items, ...props }) {

    // Get all fields for the moment, shouldn't be too much
    const fields = useStoreAPIData('fields');
    const orderlines = useStoreAPIData(['sales', saleId, 'orderlines'], { queryParams });

    if (!orderlines)
        return <SkeletonTable nCols={4} />;


    // Get items names lookup
    const itemNames = items ? arrayToMap(Object.values(items), 'id', 'name') : {};

    // Get fields columns
    const fieldsColumns = items ? Object.values(items).reduce((map, item) => {
        item.fields.forEach(field => {
            if (!map.hasOwnProperty(field))
                map[field] = {
                    field: field,
                    title: fields[field] ? fields[field].name : field,
                };
        })
        return map;
    }, {}) : {};

    // Patch data for table
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
                exportButton: true,
                exportAllData: true,
                exportFileName: `tickets_${saleId}_${new Date().toISOString().slice(0,10)}`,
            }}
        />
    );
}
