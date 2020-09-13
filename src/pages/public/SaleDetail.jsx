import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions, { apiAxios, messagesActions } from '../../redux/actions';
import { formatDate } from '../../utils';
import { getButtonColoredVariant } from '../../styles';

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
		try {
			const resp = await apiAxios.get(`/orders/${orderId}/pay?return_url=${returnUrl}`, { withCredentials: true });
			window.location.href = resp.data['redirect_url'];
		} catch (error) {
			this.props.dispatch(messagesActions.pushError(error, "Erreur avec votre commande"));
		}
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

	hasItemsInCart = () => Object.values(this.state.quantities).some(qt => qt > 0)

	canBuy = () => (
		this.props.authenticated
		&& this.state.cgvAccepted
		&& this.hasItemsInCart()
	)

	render() {
		const { classes, sale } = this.props;
		const { cgvAccepted } = this.state;
		if (!sale || this.props.fetchingSale)
			return <Loader fluid text="Loading sale..." />

		const CGVLink = props => <Link href={sale.cgv} rel="noopener" target="_blank" {...props} />
		return (
			<React.Fragment>
				<Box textAlign="center" py={6}>
					<Container>
						<h1 className={classes.title}>{sale.name}</h1>
						<h2 className={classes.subtitle}>Par {sale.association.shortname}</h2>
					</Container>
				</Box>
				<Container>

					<Grid container spacing={2}>
						<Grid item xs sm={4}>
							<h3>Description</h3>
							<p>{sale.description}</p>

							{/* TODO Display dates or not ? */}
							<h4>Dates</h4>
							<ul>
								<li>Ouverture: {sale.begin_at ? formatDate(sale.begin_at) : "Inconnue"}</li>
								<li>Fermeture: {sale.end_at ? formatDate(sale.end_at) : "Inconnue"}</li>
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
									disabled={!this.hasItemsInCart()}
									startIcon={<Delete />}
									className={classes.buttonEmpty}
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
									className={classes.buttonBuy}
									variant="contained"
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
			</React.Fragment>
		)
	}
}

SaleDetail.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = theme => ({
	title: {
		fontSize: '4em',
		margin: 0,
	},
	subtitle: {
		color: theme.palette.text.secondary,
		fontWeight: 100,
	},
	buttonEmpty: {
		...getButtonColoredVariant(theme, "warning", "outlined"),
		margin: theme.spacing(1),
	},
	buttonBuy: {
		...getButtonColoredVariant(theme, "success", "contained"),
		margin: theme.spacing(1),
	},
	alert: {
		textAlign: 'center',
		color: '#f50057',
	},
});

export default connector(withStyles(styles)(SaleDetail));