import React from 'react';
import produce from 'immer';
import { connect } from 'react-redux';
import apiActions, { apiAxios } from '../../redux/actions/api';
import { API_URL, ORDER_STATUS, STATUS_MESSAGES } from '../../constants';
import { arrayToMap } from '../../utils';

import { withStyles } from '@material-ui/core/styles';
import { Box, Container, Grid, Button, Chip, CircularProgress } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { LoadingButton } from '../../components/common/Buttons';
import { NavButton } from '../../components/common/Nav';
import OrderLineItemTicket from '../../components/orders/OrderLineItemTicket';


const INCLUDE_QUERY = [
	'orderlines',
	'orderlines__item',
	'orderlines__orderlineitems',
	'orderlines__orderlineitems__orderlinefields'
].join(',');

/** Map orderlines to orderlineitems with fields by id */
function mapOrderlinesToItemsWithFields(orderlines) {
	return orderlines.reduce((oliMap, orderline) => {
		orderline.orderlineitems.forEach(({ orderlinefields, ...orderlineitem }) => {
			// Add orderlineitem to the map
			oliMap[String(orderlineitem.id)] = {
				...orderlineitem,
				item: orderline.item,
				orderlinefields: arrayToMap(orderlinefields, olf => String(olf.id)),
			};
		});
		return oliMap;
	}, {});
}

const connector = connect((store, props) => {
	const orderId = props.match.params.order_id;
	return {
		orderId,
		order: store.api.getData(['orders', orderId], null, true),
	};
});

class OrderDetail extends React.Component {

	state = {
		orderlineitems: {},
		saving: false,
		changing: false,
		updatingStatus: false,
	}

	componentDidMount() {
		this.fetchOrder();
	}

	componentDidUpdate(prevProps) {
		// New order: update order status or tickets state
		if (this.props.order.id && this.props.order !== prevProps.order) {
			if ([2, 4].includes(this.props.order.status)) {
				this.setState(this.getStateFromOrder(), () => {
					// Wait a bit for tickets to be generated if not there
					if (Object.values(this.state.orderlineitems).length === 0)
						setTimeout(this.fetchOrder, 1000);
				});
			} else {
				this.updateStatus();
			}
		}
	}

	// Data handlers

	getStateFromOrder = () => ({
		orderlineitems: mapOrderlinesToItemsWithFields(this.props.order.orderlines),
		saving: false,
		changing: false,
	})

	fetchOrder = () => this.props.dispatch(
		apiActions.orders.find(this.props.orderId, { include: INCLUDE_QUERY })
	)

	/** Fetch status and redirect to payment or refresh order */
	updateStatus = () => {
		this.setState({ updatingStatus: true }, async () => {
			const resp = (await apiAxios.get(`/orders/${this.props.orderId}/status`)).data
			if (resp.redirect_url)
				window.location.href = resp.redirect_url;
			else
				this.setState({ updatingStatus: false }, resp.updated ? this.fetchOrder : null);
		});
	}

	downloadTickets = event => {
		window.open(`${API_URL}/orders/${this.props.orderId}/pdf`, '_blank');
	}

	// Change handlers

	handleChange = event => {
		const value = event.currentTarget.value;
		const { orderlineitemId, orderlinefieldId } = event.currentTarget.dataset;
		this.setState(prevState => produce(prevState, draft => {
			draft.changing = true;
			draft.orderlineitems[orderlineitemId].orderlinefields[orderlinefieldId].value = value;
			return draft;
		}));
	}

	resetChanges = event => this.setState(this.getStateFromOrder())

	saveChanges = event => {
		this.setState({ saving: true }, () => (
			// Update every orderlinefield
			Promise.all(
				Object.values(this.state.orderlineitems).map(orderlineitem => (
					Object.values(orderlineitem.orderlinefields).map(orderlinefield => (
						apiAxios.patch(`orderlinefields/${orderlinefield.id}`,
						               { value: orderlinefield.value },
						               { withCredentials: true })
					))
				)).flat()
			).finally(this.fetchOrder)
		));
	}

	// Renderer

	render() {
		const { classes, order } = this.props;
		// TODO Better loading
		if (!order)
			return "Loading"
		const { orderlineitems, saving, changing, updatingStatus } = this.state;
		const status = ORDER_STATUS[order.status] || {};
		const statusMessage = STATUS_MESSAGES[order.status] || {};
		return (
			<Container>
				<Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
					<h1>Commande n°{order.id}</h1>
					<Chip
						onClick={this.updateStatus}
						label={status.label || '...'}
						style={{ backgroundColor: status.color, color: '#fff' }}
						icon={updatingStatus ? <CircularProgress size="1em" style={{ color: '#fff' }} /> : null}
						clickable
					/>
				</Box>

				{/* TODO Change message // status */}
				<Box clone my={2}>
					<Alert severity={statusMessage.severity}>
						<AlertTitle>Votre commande est {status.label.toLowerCase()}</AlertTitle>
						{statusMessage.message}
						{statusMessage.link && (
							<Box mt={2}>
								<NavButton to={`/sales/${order.sale || ''}`} color="inherit" variant="outlined">
									{statusMessage.link}
								</NavButton>
							</Box>
						)}
					</Alert>
				</Box>

				<Grid container spacing={2} wrap="wrap">
					{Object.values(orderlineitems).map(orderlineitem => (
						<Grid item key={orderlineitem.id} xs sm={4} md={3}>
							<OrderLineItemTicket
								orderlineitem={orderlineitem}
								saving={saving}
								onChange={this.handleChange}
							/>
						</Grid>
					))}
				</Grid>

				<Box textAlign="right" flexWrap="wrap" mt={3}>
					<Button
						onClick={this.resetChanges}
						disabled={!changing || saving}
						className={classes.button}
					>
						Annuler les changements
					</Button>
					<LoadingButton
						onClick={this.saveChanges}
						loading={saving}
						disabled={!changing}
						className={classes.button}
						variant="contained"
						color="primary"
					>
						Sauvegarder les changements
					</LoadingButton>
					<Button
						onClick={this.downloadTickets}
						disabled={changing || saving}
						className={classes.button}
						variant="contained"
						color="primary"
					>
						Télécharger les billets
					</Button>
				</Box>
			</Container>
		);
	}
}

const styles = theme => ({
	button: {
		margin: theme.spacing(1),
	},
});

export default connector(withStyles(styles)(OrderDetail));
