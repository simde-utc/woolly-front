import React from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import { Button, Paper, TextField } from '@material-ui/core';
import Loader from '../components/common/Loader';

const connector = connect((store, props) => ({
	order: store.getData(['auth', 'currentOrder'], {}),
}))

class OrderDetail extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			orderlineitems: {},
			saving: false,
			changing: false,
		};
	}

	componentDidMount() {
		this.fetchOrder();
	}

	componentDidUpdate(prevProps) {
		if (this.props.order.id && this.props.order !== prevProps.order)
			this.setState(this.getStateFromOrder());
	}

	fetchOrder = () => {
		const orderId = this.props.match.params.order_id;
		this.props.dispatch(actions(`/orders/${orderId}?include=orderlines,`
															+ 'orderlines__item,orderlines__orderlineitems,'
															+ 'orderlines__orderlineitems__orderlinefields')
													.definePath(['auth', 'currentOrder']).get())
	}

	getStateFromOrder() {
		const orderlineitems = {};
		this.props.order.orderlines.forEach(orderline => {
			orderline.orderlineitems.forEach(({ orderlinefields, ...orderlineitem }) => {
				// Add orderlineitem to the map
				orderlineitems[String(orderlineitem.id)] = {
					...orderlineitem,
					item: orderline.item,
					orderlinefields: orderlinefields.reduce((acc, olf) => {
						acc[String(olf.id)] = olf;
						return acc;
					}, {}),
				};
			});
		});
		return { orderlineitems, saving: false, changing: false };
	}

	handleChange = event => {
		const { orderlineitemId: OI_id, orderlinefieldId: OF_id } = event.currentTarget.dataset;
		const value = event.currentTarget.value;
		this.setState(prevState => ({
			changing: true,
			orderlineitems: {
				...prevState.orderlineitems,
				[OI_id]: {
					...prevState.orderlineitems[OI_id],
					orderlinefields: {
						...prevState.orderlineitems[OI_id].orderlinefields,
						[OF_id]: {
							...prevState.orderlineitems[OI_id].orderlinefields[OF_id],
							value,
						},
					},
				},
			},
		}));
	}

	resetChanges = event => this.setState(this.getStateFromOrder())

	saveChanges = event => {
		this.setState({ saving: true }, () => {
			// Update every orderlinefield
			const options = { withCredentials: true };
			const promiseList = Object.values(this.state.orderlineitems).map(orderlineitem => {
				return Object.values(orderlineitem.orderlinefields).map(orderlinefield => (
					axios.patch(`orderlinefields/${orderlinefield.id}`, { value: orderlinefield.value }, options)
				));
			}).flat();
			Promise.all(promiseList)
							.catch(error => console.log(error)) // TODO
							.finally(this.fetchOrder)
		});
	}

	downloadTickets = event => {
		const orderId = this.props.match.params.order_id;
		window.open(`${axios.defaults.baseURL}/orders/${orderId}/pdf`, '_blank');
	}

	render() {
		const { classes, order } = this.props;
		const { orderlineitems, saving, changing } = this.state;
		return (
			<div className="container">
				<h1>Informations de la commande n°{order.id}</h1>
				<p>Vous pouvez modifier les billets qui sont éditables en cliquant sur les différents champs.</p>
				<div className={classes.ticketContainer}>
					{Object.values(orderlineitems).map(orderlineitem =>  (
						<Paper key={orderlineitem.id} className={classes.ticket}>
							<h4 className={classes.ticketTitle}>{orderlineitem.item.name}</h4>
							{Object.values(orderlineitem.orderlinefields).map(orderlinefield => (
								<TextField
									key={orderlinefield.id}
									label={orderlinefield.name}
									value={orderlinefield.value}
									required
									disabled={saving || !orderlinefield.editable}
									onChange={this.handleChange}
									classes={{ root: classes.input }}
									inputProps={{
										'data-orderlineitem-id': orderlineitem.id,
										'data-orderlinefield-id': orderlinefield.id,
									}}
								/>
							))}
						</Paper>
					))}
				</div>

				<div className={classes.buttonContainer}>
					<Button className={classes.button}
									disabled={!changing || saving} onClick={this.resetChanges}>
						Annuler les changements
					</Button>
					<Button className={classes.button} variant="contained"
									disabled={!changing} onClick={this.saveChanges}>
						{saving ? (
							<Loader size="sm" text="Sauvegarde en cours..." />
						) : (
							"Sauvegarder les changements"
						)}
					</Button>
					<Button className={classes.button} variant="contained"
									disabled={changing || saving} onClick={this.downloadTickets}>
						Télécharger les billets
					</Button>
				</div>
			</div>
		);
	}
}

const styles = theme => ({
	ticketContainer: {
		// display: 'flex',
		// flexDirection: 'columnn',
		// flexWrap: 'wrap',
	},
	buttonContainer: {
		textAlign: 'right',
		flexWrap: 'wrap',
		marginTop: 50,
		// TODO breakdown + icon
	},

	ticket: {
		display: 'flex',
		flexWrap: 'wrap',
		margin: '1em 0',
		padding: 10,
	},
	ticketTitle: {
		width: '100%',
		margin: '0 0 10px',
		fontWeigth: 100,
	},
	input: {
		flex: 1,
		margin: '0 5px',
	},
	button: {
		margin: '0.25em 1em',
	},
});

export default connector(withStyles(styles)(OrderDetail));
