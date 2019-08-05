import React from 'react'
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { Payment, Delete } from '@material-ui/icons';
import OrderlinesList from './OrderlinesList';


class UnpaidOrderDialog extends React.Component {

	render() {
		const { order, open, onClose } = this.props;
		return (
			<Dialog
				open={Boolean(open && order)}
				onClose={onClose}
				disableBackdropClick={Boolean(onClose)}
				aria-labelledby="unpaid-order-dialog-title"
				aria-describedby="unpaid-order-dialog-description"
			>
				<DialogTitle id="unpaid-order-dialog-title">Commande non payée</DialogTitle>
				<DialogContent>
					<DialogContentText id="unpaid-order-dialog-description" component="div">
						Vous avez déjà une commande non payée pour cette vente:
						<OrderlinesList
							orderlines={order ? order.orderlines : []}
							prefix=" - "
						/>
						Veuillez la payer ou l'annuler avant d'en refaire une autre.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.props.cancelOrder} color="secondary">
						<Delete style={{ marginRight: 10 }} /> Annuler
					</Button>
					<Button onClick={this.props.payOrder} color="primary" autoFocus>
						<Payment style={{ marginRight: 10 }} /> Payer
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

UnpaidOrderDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func,
	order: PropTypes.object,
	payOrder: PropTypes.func.isRequired,
	cancelOrder: PropTypes.func.isRequired,
}

const styles = {

};

export default withStyles(styles)(UnpaidOrderDialog);
