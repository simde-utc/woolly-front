import React from 'react'
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText } from '@material-ui/core';

class OrderlinesList extends React.Component {
	render() {
		const { orderlines, listProps, prefix } = this.props;
		return (
			<List {...listProps}>
				{orderlines.map(orderline => (
					<ListItem key={orderline.id}>
						<ListItemText primary={`${prefix}${orderline.quantity} x ${orderline.item.name}`} />
					</ListItem>
				))}
			</List>
		);
	}
}

OrderlinesList.propTypes = {
	orderlines: PropTypes.arrayOf(PropTypes.object).isRequired,
	prefix: PropTypes.string,
	listProps: PropTypes.object,
}

OrderlinesList.defaultProps = {
	prefix: '',
	listProps: {},
}

export default OrderlinesList;

