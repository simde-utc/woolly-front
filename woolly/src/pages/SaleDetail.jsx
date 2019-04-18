import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableRow, TableCell,
				 Button, TextField, Paper } from '@material-ui/core/';
import { ShoppingCart, Delete } from '@material-ui/icons';


// import { FontAwesomeIcon } from '@fontawesome/react-fontawesome';
// import { faShoppingCart, faTrashAlt } from '@fontawesome/free-solid-svg-icons';

const FontAwesomeIcon = (...args) => null
const faShoppingCart = (...args) => null
const faTrashAlt = (...args) => null



// L'objet JSX ci-dessous ne sert qu'à la simulation de données qu'on aurait récupérées depuis la DB
// TODO : à supprimer après connection avec la BDD ainsi qu'après avoir changer les lignes utilisant l'objet
const CURRENT_SALE_DATA = {
	titre: "Courses de Baignoires dans l'Oise",
	association: {
		name: "Baignoires dans l'Oise",
	},
	description: "Les baignoires dans l’Oise, c’est pas n’importe quelle course ! Rien que pour vous régaler, le BDE organise un événement frappant cette année : une descente d’un kilomètre le long de notre magnifique et somptueuse rivière.",
	dates: ["Ouverture : 17/08/2018","Fermeture : 29/09/2018"],
	quantites: 100,
	items: [
		{ id: 1530, title: "Cotisation", price: 1},
		{ id: 1531, title: "P'tit jaune à Marseille", price: 2},
		{ id: 1532, title: "Limonade", price: 0.85}
	]
}

class SaleDetail extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			quantities: {},
		};
	}

	componentDidMount() {
		// 
	}

	handleChange = event => {
		const { id: key, value } = event.currentTarget;
		this.setState(prevState => ({
			quantities: {
				...prevState.quantities,
				[key]: value,
			},
		}));
	}

	handleReset = () => this.setState({ quantities: {} })

	renderItemsTable = () => {
		const { classes } = this.props;
		const sale = CURRENT_SALE_DATA
		// Utilisation de CURRENT_SALE_DATA à supprimer plus tard

		return (
			<Table>
				<TableBody>
					{sale.items.map(item => (
						<TableRow key={item.id} className={classes.trow}>
							<TableCell className={classes.text}>{item.title}</TableCell>
							<TableCell className={classes.text}>{item.price.toFixed(2)} €</TableCell>
							<TableCell>
								<TextField
									id={String(item.id)}
									value={this.state.quantities[item.id] || 0}
									onChange={this.handleChange}
									type="number"
									inputProps={{ min: 0, max: item.max_per_user }}
									classes={{ root: classes.text }}
									style={{ width: '3em' }}
									InputLabelProps={{ shrink: true }}
									margin="normal"
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		)
	}


	render(){
		const { classes } = this.props;
		const isConnected = true;

		const sale = CURRENT_SALE_DATA;

		return(
			<div className="container" style={{paddingTop: "60px"}}>

				<h1 className={classes.title}>{sale.titre}</h1>
				<h2 className={classes.subtitle}>Organisé par {sale.association.name}</h2>

				<div className={classes.details}>
					<div className={classes.description}>
						<h4 className={classes.detailsTitles}>Description</h4>
						<p>{sale.description}</p> 
					</div>
					<div className={classes.numbersContainer}>
						<div className={classes.numbers}>
							<h4 className={classes.detailsTitles}>Dates</h4>
							{sale.dates.map((date, key) => (
								<span key={key} className={classes.date}>{date}</span>
							))}
						</div>
						<div className={classes.numbers}>
							<h4 className={classes.detailsTitles}>Quantités</h4>
							<p style={{fontSize: "1.6em"}}>{sale.quantites}</p>
						</div>
					</div>
				</div>

				<div className={classes.itemsHead}>
					<h3 className={classes.itemsTitle}>Items en ventes</h3>
					<div className={classes.itemsButtons}>
						<Button
							color="primary"
							variant="contained"
							disabled={!isConnected}
							style={{margin: '0 1em',padding: '.85rem 2.13rem'}}
						>
							<ShoppingCart className={classes.icon} /> ACHETER
						</Button>
						<Button
							color="secondary" 
							variant="outlined" 
							style={{margin: '0 1em',padding: '.85rem 2.13rem', borderWidth: "2px"}}
							onClick={this.handleReset}
						>
							<Delete className={classes.icon} /> VIDER
						</Button>
					</div>
				</div>

				{!isConnected && <p className={classes.alert}>Veuillez vous connecter pour acheter.</p>}
				<Paper className={classes.tableRoot}>
				{this.renderItemsTable()}
				</Paper>
			</div>
		)
	}
}

SaleDetail.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = theme => ({
	trow: {
		height: 80,
		transition: "box-shadow .45s ease",
		'&:hover': {
			boxShadow: "0 8px 17px 0 rgba(0,0,0,.2), 0 6px 20px 0 rgba(0,0,0,.19)"
		}
	},
	tcell: {
		borderTop: "1px solid rgba(0,0,0,.2)",
		fontFamily: "roboto",
		fontWeight: 100,
		padding: "0.8em 2em"
	},
	title: {
		fontFamily: 'roboto',
		fontWeight: 100,
		fontSize: '3rem',
		textAlign: 'center',
		margin: '5px 0',
	},
	subtitle: {
		textAlign: 'center',
		fontFamily: 'roboto',
		fontWeight: 100,
		fontSize: '1.3rem',
		marginTop: 0,
	},
	details: {
		display: 'flex',
		flexDirection: 'row',
		[theme.breakpoints.down('xs')]: {
			flexDirection: 'column'
		}
	},
	description: {
		textAlign: "justify",
		paddingRight: "24px",
		fontFamily: "roboto",
		fontWeight: "100",
		flex: "0 0 50%",
		maxWidth: "50%",
		[theme.breakpoints.down('xs')]:{
			maxWidth: "100%",
			paddingRight: 0
		}
	},
	numbersContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		flexGrow: 2
	},
	text: {
		margin: 0,
		fontSize: 18,
    fontWeight: 100,
	},
	icon: {
		marginRight: 10,
	},
	date: {
		display: "block",
		fontFamily: "roboto",
		fontWeight: "100",
	},
	detailsTitles: {
		fontFamily: 'roboto',
		fontWeight: 100,
		fontSize: "1.4rem",
	},
	itemsTitle: {
		fontFamily: 'roboto',
		fontWeight: 100,
		fontSize: "2rem",
		flex: "0 0 50%",
	},
	itemsButtons: {
		flex: "0 0 50%",
		display: "flex",
		flexDirection: "row-reverse",
	},
	itemsHead: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		[theme.breakpoints.down('sm')]: {
			flexDirection: "column"
		}
	},
	tableRoot: {
		width: "100%",
		overflowX: 'auto',
		marginTop: theme.spacing.unit*3,
		marginBottom: theme.spacing.unit*3
	},
	alert: {
		textAlign: "center",
		margin: "25px 0",
		color: "#f50057",
		fontSize: "1.2em",
		fontFamily: "roboto",
		fontWeight: 100,
	}
});

export default withStyles(styles)(SaleDetail)