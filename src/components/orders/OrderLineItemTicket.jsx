import React from 'react';
import { Box, Paper, TextField } from '@material-ui/core';
import { isEmpty } from '../../utils';


// TODO Different Input types

export default function OrderLineItemTicket({ orderlineitem, ...props }) {
    return (
        <Box clone display="flex" flexDirection="column" p={2}>
            <Paper>
                <Box clone mt={0}>
                    <h4>{orderlineitem.item.name}</h4>
                </Box>
                {isEmpty(orderlineitem.orderlinefields) ? (
                    <p>Pas de champs</p>
                ) : (
                    Object.values(orderlineitem.orderlinefields).map(orderlinefield => (
                        <TextField
                            key={orderlinefield.id}
                            label={orderlinefield.name}
                            value={orderlinefield.value}
                            onChange={props.onChange}
                            inputProps={{
                                'data-orderlineitem-id': orderlineitem.id,
                                'data-orderlinefield-id': orderlinefield.id,
                            }}
                            disabled={props.saving || !orderlinefield.editable}
                            required
                        />
                    ))
                )}
            </Paper>
        </Box>
    );
}