import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter } from 'react-router';

import { withStyles } from '@material-ui/core/styles';
import { SaveAlt, Edit, PlayCircleOutline, Clear } from '@material-ui/icons';
import { Table, TableBody, TableCell, TableHead, TableRow,
				 List, ListItem, ListItemText, Button } from '@material-ui/core';
import OrderlinesList from './OrderlinesList';

const OLL_PROPS = { dense: true, disablePadding: true };

const ORDER_STATUS = {
	0: { color: '#565656', actions: [ 'cancel', ],            label: 'En cours' },
	1: { color: '#ff5722', actions: [ 'cancel', ],            label: 'En attente de Validation' },
	2: { color: '#008805', actions: [ 'download', 'modify' ], label: 'Validée' },
	3: { color: '#ff5722', actions: [ 'cancel', ],            label: 'En attente de Paiement' },
	4: { color: '#008805', actions: [ 'download', 'modify' ], label: 'Payé' },
	5: { color: '#000000', actions: [],                       label: 'Expirée' },
	6: { color: '#e00000', actions: [],                       label: 'Annulée' },
}

const ACTIONS = {
	download: { text: "Télécharger les billets", Icon: SaveAlt,           },
	modify:   { text: "Modifier la commande",    Icon: Edit,              },
	continue: { text: "Continuer la commande",   Icon: PlayCircleOutline, },
	cancel:   { text: "Annuler la commande",     Icon: Clear,             },
}

const ActionButton = ({ order, text, Icon, onClick }) => (
	<Button size="small" title={text} onClick={onClick}
					data-order-id={order.id} data-sale-id={order.sale.id}>
		<Icon title={text} />
	</Button>
);

const Cell = withStyles({
	head: {
		fontWeight: 500,
		fontSize: '1em',
		color: 'rgba(0,0,0,.7)',
	},
	root: {
		padding: '8px 5px',
	},
})(TableCell);

class OrdersList extends React.Component{

	action_download = event => {
		const orderId = event.currentTarget.getAttribute('data-order-id');
		window.open(`${axios.defaults.baseURL}/orders/${orderId}/pdf?download`, '_blank');
	}
	action_modify = event => {
		const orderId = event.currentTarget.getAttribute('data-order-id');
		this.props.history.push(`/orders/${orderId}`);
	}
	action_continue = event => {
		const saleId = event.currentTarget.getAttribute('data-sale-id');
		this.props.history.push(`/sales/${saleId}`);
	}
	action_cancel = event => {
		const orderId = event.currentTarget.getAttribute('data-order-id');
		axios.delete(`/orders/${orderId}`, { withCredentials: true })
						.then(this.props.updateOrders)
	}

	getOrderRow = order => {
		const status = ORDER_STATUS[order.status] || {};
		const statusCell = <span style={{ color: status.color }}>{status.label}</span>;
		const actionsCell = status.actions.map(key => (
			<ActionButton key={key} {...ACTIONS[key]} order={order} onClick={this[`action_${key}`]} />
		));

		return (
			<TableRow key={order.id}>
				<Cell>{order.sale.name}</Cell>
				<Cell align="center">{statusCell}</Cell>
				<Cell align="center">{actionsCell}</Cell>
				<Cell><OrderlinesList orderlines={order.orderlines} listProps={OLL_PROPS} /></Cell>
			</TableRow>
		);
	}

	getOrderlinesList(orderlines) {
		return (
			<List dense disablePadding>
				{orderlines.map(orderline => (
					<ListItem key={orderline.id}>
						<ListItemText primary={`${orderline.quantity} x ${orderline.item.name}`} />
					</ListItem>
				))}
			</List>
		);
	}

	render() {
		const { classes, orders } = this.props
		return(
			<div className={classes.container}>
				<Table>
					<TableHead>
						<TableRow className={classes.row}>
							<Cell>Vente</Cell>
							<Cell align="center">Statut</Cell>
							<Cell align="center">Actions</Cell>
							<Cell>Articles</Cell>
						</TableRow>
					</TableHead>
					<TableBody>
						{orders.map(this.getOrderRow)}
					</TableBody>
				</Table>
			</div>
		);
	}
}

OrdersList.propTypes = {
	classes: PropTypes.object.isRequired,
	orders: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const styles = theme => ({
	container: {
		overflowX: 'auto',
	},
	row: {
		height: '48px',
	},
});

export default withRouter(withStyles(styles)(OrdersList));