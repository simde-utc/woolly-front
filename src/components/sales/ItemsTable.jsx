import React from 'react'
import PropTypes from 'prop-types';

import Loader from '../common/Loader';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableRow, TableCell, TextField } from '@material-ui/core/';

class ItemsTable extends React.Component {
	render() {
 		const { classes, items, disabled, quantities } = this.props;
 		if (!items)
 			return <Loader text="Loading items..." />

 		if (items.length === 0)
 			return <p className={classes.message}>Il n'y a aucun item en vente !</p>

 		// TODO Group items
		return (
			<Table>
				<TableBody>
					{items.map(item => (
						<TableRow key={item.id} className={classes.row}>
							<TableCell className={classes.cell}>{item.name}</TableCell>
							<TableCell className={classes.cell}>{item.price.toFixed(2)} €</TableCell>
							{quantities && (
								<TableCell>
									<TextField
										value={quantities[item.id] || 0}
										onChange={this.props.onQuantityChange}
										disabled={disabled}
										title={disabled ? "Connectez vous pour acheter" : null}
										type="number"
										inputProps={{ min: 0, max: item.max_per_user, 'data-item-id': String(item.id) }}
										classes={{ root: classes.cell }}
										InputLabelProps={{ shrink: true }}
										margin="normal"
									/>
								</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		)
	}
}

ItemsTable.propTypes = {
	classes: PropTypes.object.isRequired,
	disabled: PropTypes.bool,
	items: PropTypes.array,
	quantities: PropTypes.object,
	onQuantityChange: PropTypes.func,
}

ItemsTable.defaultProps = {
	disabled: false,
	items: [],
	quantities: null,
	onQuantityChange: null,
}

const styles = {
	message: {
		textAlign: 'center',
	},
	row: {
		height: 80,
		transition: 'box-shadow .45s ease',
		'&:hover': {
			boxShadow: '0 8px 17px 0 rgba(0,0,0,.2), 0 6px 20px 0 rgba(0,0,0,.19)',
		},
	},
	cell: {
		margin: 0,
		fontSize: 18,
		fontWeight: 100,
	},
};

export default withStyles(styles)(ItemsTable);
