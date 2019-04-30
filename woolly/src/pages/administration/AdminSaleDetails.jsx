import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import SaleSummary from '../../components/SaleSummary'
import ItemSoldDetail from '../../components/ItemSoldDetail'

const CURRENT_ASSO_SALES_DATA = {
        titre: "Courses de Baignoires dans l'Oise",
        association: {
            name: "Baignoires dans l'Oise",
        },
        description: "Les baignoires dans l’Oise, c’est pas n’importe quelle course ! Rien que pour vous régaler, le BDE organise un événement frappant cette année : une descente d’un kilomètre le long de notre magnifique et somptueuse rivière.",
        dates: ["Ouverture : 17/08/2018","Fermeture : 29/09/2018"],
        quantites: 100,
        items: [
            { 
                id: 1530, 
                title: "Cotisation", 
                price: 1,
                buyers: [
                    { name: "Jacques", firstname: "Alexandre", status: "cotisant", quantity: 2 },
                    { name: "Hazard", firstname: "Victor", status: "cotisant", quantity: 3 },
                    { name: "Belun", firstname: "Camille", status: "cotisant", quantity: 1 },
                    { name: "Soustrane", firstname: "Chloé", status: "exté", quantity: 1 },
                    { name: "Lamute", firstname: "Pierre", status: "cotisant", quantity: 4 },
                    { name: "Perrin", firstname: "Perrine", status: "exté", quantity: 3 },
                    { name: "Chateau", firstname: "Grégoire", status: "cotisant", quantity: 1 },
                    { name: "Police", firstname: "Roxane", status: "cotisant", quantity: 1 },
                    { name: "Sumfortyone", firstname: "Hellsong", status: "cotisant", quantity: 1 },
                    { name: "Greenday", firstname: "Vacances", status: "cotisant", quantity: 45 },
                ]
            },
            { 
                id: 1531, 
                title: "P'tit jaune à Marseille", 
                price: 2,
                buyers: [
                    { name: "Jacques", firstname: "Alexandre", status: "cotisant", quantity: 2 },
                    { name: "Hazard", firstname: "Victor", status: "cotisant", quantity: 3 },
                    { name: "Belun", firstname: "Camille", status: "cotisant", quantity: 1 },
                    { name: "Soustrane", firstname: "Chloé", status: "exté", quantity: 1 },
                    { name: "Lamute", firstname: "Pierre", status: "cotisant", quantity: 4 },
                    { name: "Perrin", firstname: "Perrine", status: "exté", quantity: 3 },
                    { name: "Chateau", firstname: "Grégoire", status: "cotisant", quantity: 1 },
                    { name: "Police", firstname: "Roxane", status: "cotisant", quantity: 1 },
                    { name: "Sumfortyone", firstname: "Hellsong", status: "cotisant", quantity: 1 },
                    { name: "Greenday", firstname: "Vacances", status: "cotisant", quantity: 45 },
                ]
            },
            { 
                id: 1532, 
                title: "Limonade", 
                price: 0.85,
                buyers: [
                    { name: "Jacques", firstname: "Alexandre", status: "cotisant", quantity: 2 },
                    { name: "Hazard", firstname: "Victor", status: "cotisant", quantity: 3 },
                    { name: "Belun", firstname: "Camille", status: "cotisant", quantity: 1 },
                    { name: "Soustrane", firstname: "Chloé", status: "exté", quantity: 1 },
                    { name: "Lamute", firstname: "Pierre", status: "cotisant", quantity: 4 },
                    { name: "Perrin", firstname: "Perrine", status: "exté", quantity: 3 },
                    { name: "Chateau", firstname: "Grégoire", status: "cotisant", quantity: 1 },
                    { name: "Police", firstname: "Roxane", status: "cotisant", quantity: 1 },
                    { name: "Sumfortyone", firstname: "Hellsong", status: "cotisant", quantity: 1 },
                    { name: "Greenday", firstname: "Vacances", status: "cotisant", quantity: 45 },
                ]
            }
        ]
    }

class AdminSaleDetails extends React.Component{
    salesNumbers = (sales) => {
        let totalItemSold = Array(sales.length)
        let totalMoneyEarned = Array(sales.length)
        for(let i = 0; i < sales.length; i++){
            for(let j = 0; j < sales[i].buyers.length; j++){
                if(isNaN(totalItemSold[i])) totalItemSold[i] = 0
                totalItemSold[i] += sales[i].buyers[j].quantity
            }
            totalMoneyEarned[i] = totalItemSold[i]*sales[i].price
        }
        return { totalItemSold : totalItemSold, totalMoneyEarned : totalMoneyEarned } 
    }

    render(){
        const { classes } = this.props;

        const sale = CURRENT_ASSO_SALES_DATA;
        
        const numbers = this.salesNumbers(sale.items)
        const itemSold = numbers.totalItemSold.reduce((accumulator, currentValue) => accumulator + currentValue)
        const moneyEarned = numbers.totalMoneyEarned.reduce((accumulator, currentValue) => accumulator + currentValue).toFixed(2)

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
                <SaleSummary sold={itemSold} earned={moneyEarned} />
                {
                    sale.items.map((element, key) => <ItemSoldDetail item={element} key={key} />)
                }
            </div>
        )
    }
}

AdminSaleDetails.propTypes = {
	classes: PropTypes.object.isRequired,
}

const styles = theme => ({
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
})

export default withStyles(styles)(AdminSaleDetails)