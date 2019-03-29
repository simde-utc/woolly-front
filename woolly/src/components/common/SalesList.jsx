import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText } from '@material-ui/core';

class SalesList extends React.Component {
	render() {
		const { sales } = this.props;
		if (sales.length === 0)
			return <div>No sales</div>

		return (
			<List>
				{sales.map(sale => (
					<ListItem key={sale.id}>
						{/* <ListItemIcon><FolderIcon /></ListItemIcon> */}
						<ListItemText
							primary={sale.name}
							// secondary={sale.association.name}
						/>
					</ListItem>
				))}
			</List>
		);
	}
}

SalesList.propTypes = {
	sales: PropTypes.arrayOf(PropTypes.object),
}

export default SalesList;
