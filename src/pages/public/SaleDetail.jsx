import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DATA_SCOPES } from 'redux/constants';
import apiActions from 'redux/actions/api';
import messagesActions from 'redux/actions/messages';
import { apiAxios } from 'utils/api';

import { isPast } from 'date-fns';
import { formatDate } from 'utils/format';
import { getCountdown } from 'utils/api';
import { getButtonColoredVariant } from 'utils/styles';

import Loader from 'components/common/Loader';
import ItemsTable from 'components/sales/ItemsTable';
import UnpaidOrderDialog from 'components/orders/UnpaidOrderDialog';
import { Link } from 'components/common/Nav';

import {withStyles} from '@material-ui/core/styles';
import {
	Container, Box, Grid, Button, Paper, FormControlLabel, Checkbox,
	Collapse, LinearProgress,Typography,
} from '@material-ui/core';
import {ShoppingCart, Delete} from '@material-ui/icons';
import {Alert, AlertTitle} from '@material-ui/lab';


function LinearProgressWithLabel(props) {
	return (
		<Box display="flex" alignItems="center" direction="row">
			{props.value ? (
				<Box width="100%" mr={1} ml={1}>
					<LinearProgress variant="determinate" {...props} />
					<LinearProgress variant="determinate" {...props} />
				</Box>
			) : (
				<Box width="100%" mr={1} ml={1}>
					<LinearProgress {...props} />
					<LinearProgress/>
				</Box>
			)}
			<Box mr={1}>
				<Typography variant="body2" color="textSecondary" display="inline">
					{props.text}
				</Typography>
			</Box>
		</Box>
	);
}


const connector = connect((store, props) => {
	const saleId = props.match.params.sale_id;
	return {
		saleId,
		authenticated: Boolean(store.api.getData('auth', {}).authenticated),
		sale: store.api.findData('sales', saleId),
		order: store.api.getData(['sales', saleId, 'userOrder'], null, true),
		items: store.api.getData(['sales', saleId, 'items']),
	};
});

class SaleDetail extends React.Component{

	state = {
		quantities: {},
		buying: false,
		cgvAccepted: false,
		progress: 0,
		timeLeft: "Chargement...",
	}

	componentDidMount() {
		const saleId = this.props.saleId;
		if (this.props.authenticated)
			this.fetchOrder();

		if (!this.props.sale?.association?.id)
			this.props.dispatch(apiActions.sales.find(saleId, { include: "association" }));

		if (!this.props.items)
			this.props.dispatch(apiActions.sales(saleId).items.all());

		this.interval = setInterval(() => {
			if (document.getElementById(this.props.sale.id)) {
				const countdown = getCountdown(this.props.sale.begin_at);
				if (!countdown.timer)
					window.location.reload(false);

				this.setState(prevState => ({...prevState, progress: countdown.nbSeconds, timeLeft: countdown.timer}))
			}
		}, 1000);
	}

	componentDidUpdate(prevProps) {
		const order = this.props.order;

		// Update quantities from current order
		if (prevProps.order !== order && order?.orderlines?.length) {
			this.setState({
				quantities: order.orderlines.reduce((acc, orderline) => {
					acc[orderline.item] = orderline.quantity;
					return acc;
				}, {})
			});
		}
	}

  componentWillUnmount() {
	  clearInterval(this.interval);
  }

	// -----------------------------------------------------
	// 		Order handlers
	// -----------------------------------------------------

	getOrderAction = () => (
		apiActions
		.sales(this.props.saleId).orders()
		.configure(action => {
			action.path = ['sales', this.props.saleId, 'userOrder' ];
			action.idIsGiven = false;
			action.options.meta = {
				dataScope: DATA_SCOPES.FULL,
			};
		})
	)

	fetchOrder = () => {
		// Try to find a previous ongoing order
		this.getOrderAction().get({ filter: "status=0" }).payload.then(resp => {
			if (resp.data.results.length) {
				const orderId = resp.data.results[0].id
				this.props.dispatch(this.getOrderAction().find(orderId, { include: 'orderlines' }));
			}
		});
	}

	/** Save order on the server */
	saveOrder = async (event, notif = true, update = false) => {
		let order = this.props.order?.id;
		// Create order if not fetched
		if (!order) {
			const action = this.getOrderAction().create({});
			order = (await action.payload).data.id;
			this.props.dispatch(action);
		}

		// Save all orderlines
		const options = { withCredentials: true };
		const promises = Promise.all(
			Object.entries(this.state.quantities).reduce((calls, [item, quantity]) => {
				const data = { order, item, quantity };
				calls.push(apiAxios.post('orderlines', data, options));
				return calls;
			}, [])
		);

		if (notif)
			promises.then(resp => console.log('Saved'));
		if (update)
			promises.then(this.fetchOrder);
		return promises
	}

	/** Redirect to payment */
	payOrder = async event => {
		const orderId = this.props.order?.id;
		if (orderId == null)
			return this.fetchOrder();

		const returnUrl = window.location.href.replace(this.props.location.pathname, `/orders/${orderId}`);
		try {
			const resp = await apiAxios.get(`/orders/${orderId}/pay?return_url=${returnUrl}`, { withCredentials: true });
			window.location.href = resp.data['redirect_url'];
		} catch (error) {
			this.props.dispatch(messagesActions.pushError(error, "Erreur avec votre commande"));
			this.fetchOrder();
		}
	}

	/** Cancel an order */
	cancelOrder = event => {
		apiActions.orders.delete(this.props.order.id).payload.finally(this.fetchOrder);
	}

	/** Save order and redirect to payment */
	handleBuy = event => {
		if (this.canBuy()) {
			this.setState({ buying: true }, async () => {
				await this.saveOrder(null, false, false);
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

	currentSaleState = () => {
		const sale = this.props.sale;
		if (!sale)
			return null;
		if (sale.end_at && isPast(new Date(sale.end_at)))
			return 'FINISHED';
		if (sale.begin_at && isPast(new Date(sale.begin_at)))
			return 'ONGOING';
		return 'NOT_BEGUN';
	}

	hasUnpaidOrder = () => Boolean(this.props.order && this.props.order.status === 3)

	areItemsDisabled = () => Boolean(!this.props.authenticated || this.hasUnpaidOrder())

	hasItemsInCart = () => Object.values(this.state.quantities).some(qt => qt > 0)

	canBuy = () => (
		this.props.authenticated
		&& this.state.cgvAccepted
		&& this.currentSaleState() === 'ONGOING'
		&& this.hasItemsInCart()
	)

	render() {
		const { classes, sale } = this.props;
		const { cgvAccepted } = this.state;
		if (!sale || this.props.fetchingSale)
			return <Loader fluid text="Loading sale..." />

		const saleState = this.currentSaleState()
		const CGVLink = props => <Link href={sale.cgv} rel="noopener" target="_blank" {...props} />
		return (
			<React.Fragment>
				<Box textAlign="center" py={6}>
					<Container>
						<h1 className={classes.title}>{sale.name}</h1>
						<h2 className={classes.subtitle}>Par {sale.association?.shortname || "..."}</h2>
					</Container>
				</Box>
				<Container>

					<Grid container spacing={2}>
						<Grid item xs={12} sm={4}>
							<h3>Description</h3>
							<p>{sale.description}</p>

							<h4>Liens</h4>
							<ul>
								<li><CGVLink>Conditions Vénérales de Ventes</CGVLink></li>
							</ul>

							<h4>Dates</h4>
							<ul>
								<li>Ouverture: {sale.begin_at ? formatDate(sale.begin_at) : "Inconnue"}</li>
								<li>Fermeture: {sale.end_at ? formatDate(sale.end_at) : "Inconnue"}</li>
							</ul>
						</Grid>

						<Grid item xs={12} sm={8}>
							<h3>Articles en ventes</h3>

							{saleState === 'NOT_BEGUN' && (
								<Alert severity="warning" color="info">
									<AlertTitle>La vente n'a pas encore commencée</AlertTitle>
									<span>
										Revenez d'ici {sale.begin_at && formatDate(sale.begin_at, 'fromNowStrict')} pour pouvoir commander.
									</span>
								</Alert>
							)}
							{saleState === 'FINISHED' && (
								<Alert severity="warning" color="info">
									<AlertTitle>La vente est terminée</AlertTitle>
									<span>
										Vous pouvez retrouver vos commandes liées à cette vente, <Link to="/orders">sur votre compte</Link>.
									</span>
								</Alert>
							)}
							{saleState === 'ONGOING' && (
								<React.Fragment>
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
															Veuillez accepter les CGV ci-dessus.
														</li>
													)}
												</Box>
											</Alert>
										</Box>
									</Collapse>
								</React.Fragment>
							)}

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

							{saleState === 'NOT_BEGUN' ? (
								<Box style={{width: '100%'}}>
									<Alert severity="success" variant="outlined" icon={false}>
										<AlertTitle>La vente n'a pas encore commencée, encore un peu de patience
											!</AlertTitle>
										<LinearProgressWithLabel id={sale.id} value={this.state.progress}
																 text={this.state.timeLeft}/>
									</Alert>

								</Box>
							) : (
								<Box display="flex" justifyContent="flex-end">
									<Button
										onClick={this.handleReset}
										disabled={!this.hasItemsInCart()}
										startIcon={<Delete/>}
										className={classes.buttonEmpty}
										variant="outlined"
									>
										Vider
									</Button>
									{/* SAVE BUTTON, utile  ??
								<Button
									onClick={this.saveOrder}
									// disabled={!canBuy}
									// startIcon={<Save />}
									className={classes.button}
									variant="outlined"
								>
									Sauvegarder
								</Button>
								 */}
									<Button
										onClick={this.handleBuy}
										disabled={!this.canBuy()}
										startIcon={<ShoppingCart/>}
										className={classes.buttonBuy}
										variant="contained"
									>
										Acheter
									</Button>
								</Box>


							)}

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
