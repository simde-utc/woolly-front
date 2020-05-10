import React from 'react'
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { SkeletonList } from '../common/Skeletons';

export default function OrderLinesList({ orderlines, items, prefix, ...props }) {
	if (!orderlines)
		return <SkeletonList {...props} />

	function getItem(item) {
		if (item.name)
			return item.name;
		else if (items && items.hasOwnProperty(item))
			return items[item].name;
		return '...';
	}

	return (
		<List {...props}>
			{Object.values(orderlines).map(orderline => (
				<ListItem key={orderline.id} dense={props.dense}>
					<ListItemText>
						{prefix}{orderline.quantity} &times; {getItem(orderline.item)}
					</ListItemText>
				</ListItem>
			))}
		</List>
	);
}

OrderLinesList.propTypes = {
	orderlines: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]),
	items: PropTypes.object,
	prefix: PropTypes.string,
};

OrderLinesList.defaultProps = {
	prefix: '',
};
