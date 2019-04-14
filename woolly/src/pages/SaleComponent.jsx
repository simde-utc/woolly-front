import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core/';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

// L'objet JSX ci-dessous ne sert qu'à la simulation de données qu'on aurait récupérées depuis la DB
// TODO : à supprimer après connection avec la BDD ainsi qu'après avoir changer les lignes utilisant l'objet
const CURRENT_SALE_DATA = {
    titre: "Courses de Baignoires dans l'Oise",
    soustitre: "Organisé par Baignoires dans l'Oise",
    description: "Les baignoires dans l’Oise, c’est pas n’importe quelle course ! Rien que pour vous régaler, le BDE organise un événement frappant cette année : une descente d’un kilomètre le long de notre magnifique et somptueuse rivière.",
    dates: ["Ouverture : 17/08/2018","Fermeture : 29/09/2018"],
    quantites: 100,
    items: [
        {title: "Cotisation", prix: 1},
        {title: "P'tit jaune à Marseille", prix: 2},
        {title: "Limonade", prix: 0.85}
    ]
}

class SaleComponent extends React.Component{
    constructor(props){
        super(props)
        let tempArray = Array(CURRENT_SALE_DATA.items.length) // Utilisation de CURRENT_SALE_DATA à supprimer plus tard
        tempArray = this.toZeroArray(tempArray)
        this.state = {
            itemsValues: tempArray
        }
    }

    toZeroArray = (inputArray) => {
        let array = inputArray
        for(let i = 0; i < array.length; i++){
            array[i] = 0
        }
        return array
    }

    handleChange = (e, key) => {
        e.persist()
        this.setState((state) => {
            const target = e.target
            const value = target.value
            console.log(target, value)
            let newValues = state.itemsValues
            newValues[key] = value
            return { itemsValues: newValues}
        })
    }

    renderItems = (classes) => {
        const itemsTable = CURRENT_SALE_DATA.items.map((element, key) => { // Utilisation de CURRENT_SALE_DATA à supprimer plus tard
            let nbString = "" + element.prix;
            if(!nbString.match(/\d+,\d\d/g)){ // sous format "n chiffres , 2 chiffres"
                let separatedString = nbString.split(".");
                if(separatedString.length > 1){
                    while(separatedString[1].length < 2){
                        separatedString[1] += "0"
                    }
                }
                else{
                    separatedString.push("00");
                }
                nbString = separatedString[0] + "," + separatedString[1] + " €"
            }
            return(
                <tr className={classes.trow}>
                    <td width="70%" className={classes.tcell} style={{fontSize: "1.4em"}}>{element.title}</td>
                    <td width="30%" className={classes.tcell}>{nbString}</td>
                    <td className={classes.tcell}>
                        <TextField
                            value={this.state.itemsValues[key]}
                            onChange={(e) => this.handleChange(e, key)}
                            type="number"
                            inputProps={{ min: "0", max: CURRENT_SALE_DATA.quantites}}
                            className={classes.textField}
                            style={{width: "3em"}}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                            />
                    </td>
                </tr>
            )
        })
        return <table className={classes.table}><tbody>{itemsTable}</tbody></table>
    }

    handleReset = () => {
        const newValues = this.toZeroArray(this.state.itemsValues)
        this.setState({ itemsValues: newValues })
    }

    render(){
        const { classes } = this.props;
        const isConnected = true;

        const items = this.renderItems(classes);

        return(
            <div class="container" style={{paddingTop: "60px"}}>

                {/* Utilisation de CURRENT_SALE_DATA à supprimer plus tard */}
                <h1 className={classes.title}>{CURRENT_SALE_DATA.titre}</h1>

                {/* Utilisation de CURRENT_SALE_DATA à supprimer plus tard */}
                <h2 className={classes.subtitle}>{CURRENT_SALE_DATA.soustitre}</h2>
                <div className={classes.details}>
                    <div className={classes.description} style={{textAlign: "justify", paddingRight: "24px", fontFamily: "roboto", fontWeight: "100"}}>
                        <h4 className={classes.detailsTitles}>Description</h4>
                        
                        {/* Utilisation de CURRENT_SALE_DATA à supprimer plus tard */}
                        <p>{CURRENT_SALE_DATA.description}</p> 
                    </div>
                    <div className={classes.numbers}>
                        <h4 className={classes.detailsTitles}>Dates</h4>
                        {CURRENT_SALE_DATA.dates.map((element, key) => {
                            return <span style={{display: "block", fontFamily: "roboto", fontWeight: "100"}} key={key}>{element}</span>
                        })}
                    </div>
                    <div className={classes.numbers}>
                        <h4 className={classes.detailsTitles}>Quantités</h4>
                        <p style={{fontSize: "1.6em"}}>{CURRENT_SALE_DATA.quantites}</p>
                    </div>
                </div>
                <div>
                    <div className={classes.itemsHead}>
                        <h3 className={classes.itemsTitle}>Items en ventes</h3>
                        <div className={classes.itemsButtons}>
                            <Button variant="contained" color="primary" disabled={!isConnected} style={{margin: '0 1em',padding: '.85rem 2.13rem'}}><FontAwesomeIcon icon={faShoppingCart} style={{marginRight : '10px'}}/> ACHETER</Button>
                            <Button variant="outlined" 
                                color="secondary" 
                                disabled={!isConnected} 
                                style={{margin: '0 1em',padding: '.85rem 2.13rem', borderWidth: "2px"}}
                                onClick={this.handleReset}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} style={{marginRight : '10px'}}/> RESET
                            </Button>
                        </div>
                    </div>
                    {
                        !isConnected ? (
                            <div className={classes.condition}>
                                <span className={classes.sentence}>Veuillez vous connecter pour acheter.</span>
                            </div>
                        ) : (
                            <div></div>
                        )
                    }
                    <div className={classes.items}>
                        {items}
                    </div>
                </div>
            </div>
        )
    }
}

Sale.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    trow: {
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
    table: {
        width: "100%",
        borderCollapse: "collapse"
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
    },
    description: {
        flex: "0 0 50%",
        maxWidth: "50%"
    },
    numbers: {
        flex: "0 0 25%",
        maxWidth: "25%",
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
    },
    condition: {
        textAlign: "center",
        margin: "25px 0",
    },
    sentence: {
        color: "#f50057",
        fontSize: "1.2em",
        fontFamily: "roboto",
        fontWeight: 100,
    }
});

export default withStyles(styles)(Sale)