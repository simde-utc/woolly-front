import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { NavListItem, NavIconButton } from '../common/Nav';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { isEmpty } from '../../utils';


export default function SalesList({ sales, baseUrl, withEdit, ...props }) {
	// Skeleton loader
    if (!sales) {
        return (
            <List {...props}>
                {[...Array(3).keys()].map(i => (
                    <ListItem key={i}>
                        <ListItemText
                            primary={<Skeleton variant="text" style={{ maxWidth: 300 }} />}
                            secondary={<Skeleton variant="text" style={{ maxWidth: 200 }} />}
                        />
                        <ListItemSecondaryAction>
                            <Skeleton variant="circle" width={30} height={30} />
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        );
    }
    // Empty state
    if (isEmpty(sales)) {
        return (
            <List {...props}>
                <ListItem button disabled>
                    <ListItemText primary="Pas de ventes" />
                </ListItem>
            </List>
        );
    }
    // Sales list
    return (
        <List {...props}>
            {Object.values(sales).map(sale => (
                <NavListItem key={sale.id} to={`${baseUrl}/sales/${sale.id}`} aria-label="see-sale">
                    <ListItemText primary={sale.name} />
                    {withEdit && (
	                    <ListItemSecondaryAction>
	                        <NavIconButton
	                        	to={`${baseUrl}/sales/${sale.id}/edit`}
	                        	aria-label="edit-sale"
	                        	edge="end"
	                        >
	                            <Edit />
	                        </NavIconButton>
	                    </ListItemSecondaryAction>
                    )}
                </NavListItem>
            ))}
        </List>    
    );
}

SalesList.propTypes = {
	sales: PropTypes.object,
	baseUrl: PropTypes.string,
};

SalesList.defaultProps = {
	sales: null,
	baseUrl: '',
	withEdit: false,
};
