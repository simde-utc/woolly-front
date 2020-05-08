import React from 'react'
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText } from '@material-ui/core';


export default function OrderLinesList({ orderlines, prefix, ...props }) {
	return (
		<List {...props}>
			{Object.values(orderlines).map(orderline => (
				<ListItem key={orderline.id}>
					<ListItemText>
						{prefix}{orderline.quantity} &times; {orderline.item.name}
					</ListItemText>
				</ListItem>
			))}
		</List>
	);
}

OrderLinesList.propTypes = {
	orderlines: PropTypes.arrayOf(PropTypes.object).isRequired,
	prefix: PropTypes.string,
};

OrderLinesList.defaultProps = {
	prefix: '',
};
