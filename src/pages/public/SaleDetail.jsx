import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions, { apiAxios } from '../../redux/actions';
import { formatDate } from '../../utils';

import Loader from '../../components/common/Loader';
import ItemsTable from '../../components/sales/ItemsTable';
import UnpaidOrderDialog from '../../components/orders/UnpaidOrderDialog';
import { Link } from '../../components/common/Nav';

import { withStyles } from '@material-ui/core/styles';
import { Container, Box, Grid, Button, Paper, FormControlLabel, Checkbox, Collapse } from '@material-ui/core';
import { ShoppingCart, Delete } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';


const connector = connect((store, props) => {
	const saleId = props.match.params.sale_id;
	return {
		saleId,
		authenticated: Boolean(store.getData('auth', {}).authenticated),
		sale: store.findData('sales', saleId, 'id', null),
		order: store.getData(['sales', saleId, 'userOrder'], null),
		items: store.getData(['sales', saleId, 'items'], null),
	};
});

class SaleDetail extends React.Component{

	state = {
		quantities: {},
		buying: false,
		cgvAccepted: false,
	}

	componentDidMount() {
		const saleId = this.props.saleId;
		if (this.props.authenticated && !this.props.order)
			this.fetchOrder();

		if (!this.props.sale)
			this.props.dispatch(actions.sales.find(saleId, { include: 'association' }));

		if (!this.props.items)
			this.props.dispatch(actions.sales(saleId).items.get());
	}

	componentDidUpdate(prevProps) {
		const order = this.props.order;

		// Update quantities from current order
		if (prevProps.order !== order && order && order.orderlines.length) {
			this.setState({
				quantities: order.orderlines.reduce((acc, orderline) => {
					acc[orderline.item] = orderline.quantity;
					return acc;
				}, {})
			});
		}
	}

	// -----------------------------------------------------
	// 		Order handlers
	// -----------------------------------------------------

	fetchOrder = () => {
		const saleId = this.props.saleId;
		this.props.dispatch(
			actions.sales(saleId).orders
			       .definePath(['sales', saleId, 'userOrder' ])
			       .setOptions({ meta: { action: 'updateAll'} })
			       .create({ include: 'orderlines' })
		);
	}

	/** Sabe order on the server */
	saveOrder = (event, notif = true, update = false) => {
		if (!this.props.order) {
			console.warn("No order")
			return;
		}

		// Save all orderlines
		const order = this.props.order.id;
		const options = { withCredentials: true };
		const promises = Promise.all(
			Object.entries(this.state.quantities).reduce((calls, [item, quantity]) => {
				const data = { order, item, quantity };
				calls.push(apiAxios.post('orderlines', data, options));
				return calls;
			}, [])
		);

		if (notif) // TODO
			promises.then(resp => console.log('Saved'));
		if (update)
			promises.then(this.fetchOrder);
		return promises
	}

	/** Redirect to payment */
	payOrder = async event => {
		const orderId = this.props.order.id;
		const returnUrl = window.location.href.replace(this.props.location.pathname, `/orders/${orderId}`);
		const resp = await apiAxios.get(`/orders/${orderId}/pay?return_url=${returnUrl}`, { withCredentials: true });
		window.location.href = resp.data['redirect_url'];
	}

	/** Cancel an order */
	cancelOrder = event => {
		actions.orders.delete(this.props.order.id).payload.finally(this.fetchOrder);
	}

	/** Save order and redirect to payment */
	handleBuy = event => {
		if (this.canBuy()) {
			this.setState({ buying: true }, async () => {
				await this.saveOrder();
				await this.payOrder();
			});
		}
	}

	// -----------------------------------------------------
	// 		Event handlers
	// -----------------------------------------------------

	toggleCGV = event => this.setState(prevState => ({ cgvAccepted: !prevState.cgvAccepted }))

	handleQuantityChange = event => {
		const id = Number(event.currentTarget.dataset.itemId);
		const value = Number(event.currentTarget.value);
		this.setState(prevState => ({
			quantities: {
				...prevState.quantities,
				[id]: value,
			},
		}));
	}

	handleReset = event => this.setState({ quantities: {} })

	// -----------------------------------------------------
	// 		Display
	// -----------------------------------------------------

	hasUnpaidOrder = () => Boolean(this.props.order && this.props.order.status === 3)

	areItemsDisabled = () => Boolean(!this.props.authenticated || this.hasUnpaidOrder())

	canBuy = () => (
		this.props.authenticated
		&& this.state.cgvAccepted
		&& Object.values(this.state.quantities).some(qt => qt > 0)
	)

	render() {
		const { classes, sale } = this.props;
		const { cgvAccepted } = this.state;
		if (!sale || this.props.fetchingSale)
			return <Loader fluid text="Loading sale..." />

		const CGVLink = props => <Link href={sale.cgv} rel="noopener" target="_blank" {...props} />
		return (
			<Container>
				<h1>{sale.name}</h1>

				<Grid container spacing={2}>
					<Grid item xs sm={4}>
						<h2>Organisé par {sale.association.shortname}</h2>
						<h4>Description</h4>
						<p>{sale.description}</p>

						<h4>Dates</h4>
						<ul>
							<li>Ouverture: {formatDate(sale.begin_at)}</li>
							<li>Fermeture: {formatDate(sale.end_at)}</li>
						</ul>
					</Grid>

					<Grid item xs sm={8}>
						<h3>Articles en ventes</h3>

						<FormControlLabel
							control={(
								<Checkbox checked={cgvAccepted} onChange={this.toggleCGV} />
							)}
							label={(
								<span>
									J'accepte les <CGVLink>conditions générales de ventes</CGVLink>
								</span>
							)}
						/>

						<Collapse in={!this.state.cgvAccepted || !this.props.authenticated}>
							<Box clone my={1}>
								<Alert severity="info">
									<AlertTitle>Pour acheter</AlertTitle>
									<Box component="ul" m={0} pl={2}>
										{!this.props.authenticated && (
											<li>
												Veuillez <Link to="/login" color="inherit" underline="always">vous connecter</Link> pour acheter.
											</li>
										)}
										{!this.state.cgvAccepted && (
											<li>
												Veuillez accepter les CGV ci-dessus pour acheter.
											</li>
										)}
									</Box>
								</Alert>
							</Box>
						</Collapse>

						<Box clone my={2}>
							<Paper>
								<ItemsTable
									disabled={this.areItemsDisabled()}
									items={this.props.items}
									quantities={this.state.quantities}
									onQuantityChange={this.handleQuantityChange}
								/>
							</Paper>
						</Box>

						<Box display="flex" justifyContent="flex-end">
							<Button
								onClick={this.handleReset}
								disabled={!this.hasUnpaidOrder()}
								startIcon={<Delete />}
								className={classes.button}
								variant="outlined"
							>
								Vider
							</Button>
							{/* SAVE BUTTON, utile  ??
							<Button
								onClick={this.saveOrder}
								// disabled={!canBuy}
								startIcon={<Save />}
								className={classes.button}
								variant="outlined"
							>
								Sauvegarder
							</Button>
							 */}
							<Button
								onClick={this.handleBuy}
								disabled={!this.canBuy()}
								startIcon={<ShoppingCart />}
								className={classes.button}
								variant="contained"
								color="primary"
							>
								Acheter
							</Button>
						</Box>
					</Grid>

				</Grid>

				<UnpaidOrderDialog
					order={this.props.order}
					items={this.props.items}
					open={this.hasUnpaidOrder()}
					payOrder={this.payOrder}
					cancelOrder={this.cancelOrder}
				/>
			</Container>
		)
	}
}

SaleDetail.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = theme => ({
	button: {
		margin: theme.spacing(1),
	},
	alert: {
		textAlign: 'center',
		color: '#f50057',
	},
});

export default connector(withStyles(styles)(SaleDetail));