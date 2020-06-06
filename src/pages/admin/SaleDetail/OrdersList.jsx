import React from 'react';
import MaterialTable from 'material-table';
import { SkeletonTable } from '../../../components/common/Skeletons';
import OrderLinesList from '../../../components/orders/OrderLinesList';
import { useStoreAPIData } from '../../../redux/hooks';
import { ORDER_STATUS, MaterialTableIcons } from '../../../constants';
import { formatDate } from '../../../utils';
import { parseISO } from 'date-fns'


const queryParams = {
    include: 'owner,orderlines',
};

export default function OrdersList({ saleId, items, ...props }) {
    const orders = useStoreAPIData(['sales', saleId, 'orders'], { queryParams });

    if (!orders)
        return <SkeletonTable nCols={4} />;

    // Get items names lookup
    const ordersList = Object.values(orders).map(order => ({
        id: order.id,
        owner: `${order.owner.first_name} ${order.owner.last_name}`,
        updated_at: parseISO(order.updated_at),
        status: ORDER_STATUS[order.status] || {},
        orderlines: order.orderlines,
    }))

    // OrderLinesList

    return (
        <MaterialTable
            title="Commandes"
            data={ordersList}
            columns={[
                { title: 'ID', field: 'id' },
                { title: 'Acheteur', field: 'owner' },
                {
                    title: 'Status',
                    field: 'status',
                    render: row => (
                        <span style={{ color: row.status.color }}>
                            {row.status.label || 'Inconnu'}
                        </span>
                    ),
                },
                {
                    title: 'Mise à jour',
                    field: 'updated_at',
                    searchable: false,
                    render: row => (
                        <span>{formatDate(row.updated_at, 'datetime')}</span>
                    ),
                },
                {
                    title: 'Articles',
                    field: 'orderlines',
                    searchable: false,
                    render: row => (
                        <OrderLinesList
                            orderlines={row.orderlines}
                            items={items}
                            prefix="- "
                            disablePadding
                            dense
                        />
                    ),
                },
            ]}
            icons={MaterialTableIcons}
            options={{
                search: true,
            }}

        />
    );
}
