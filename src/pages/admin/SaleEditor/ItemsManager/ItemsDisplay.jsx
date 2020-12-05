import React from 'react';
import { Box } from '@material-ui/core';

import { isEmpty } from 'utils/helpers';

import NoItems from './NoItems';
import GroupBlock from './GroupBlock';


export default function ItemsDisplay({ itemgroups, ...props }) {
    const orphanItemIds = Object.values(props.items).filter(item => item.group === null).map(item => item.id);
    const hasOrphans = !isEmpty(orphanItemIds);

    if (!hasOrphans && isEmpty(itemgroups))
        return <NoItems onAdd={props.onAdd} />;

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
                    itemgroup={{
                        name: <span style={{ fontStyle: 'italic' }}>Sans groupe</span>,
                        items: orphanItemIds,
                    }}
                    {...props}
                />
            )}
        </Box>
    );
}
