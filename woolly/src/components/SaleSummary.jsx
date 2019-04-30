import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'

class SaleSummary extends React.Component {
    render(){
        const { classes } = this.props
        return(
            <div className={classes.summaryRoot}>
                <div className={classes.cell}>
                    <h2 className={classes.summaryTitles}>Nombre d'items vendus</h2>
                    <span className={classes.summaryNumbers}>{this.props.sold ? this.props.sold : 0}</span>
                </div>
                <div className={classes.cell}>
                    <h2 className={classes.summaryTitles}>Somme totale récoltée</h2>
                    <span className={classes.summaryNumbers}>{this.props.earned ? this.props.earned : 0}€</span>
                </div>
            </div>
        )
    }
}

SaleSummary.propTypes = {
    classes: PropTypes.object.isRequired
}

const style = theme => ({
    summaryRoot: {
        display: "flex",
        justifyContent: "center",
        margin: "1em 1em 2em 1em",
        paddingTop: "1em",
        borderTop: "1px solid rgba(0,0,0,.1)"
    },
    cell: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        minWidth: "25vw",
        padding: "0 1em"
    },
    summaryTitles: {
        fontFamily: "roboto",
        fontWeight: 400,
        fontSize: "1.4em",
        textAlign: "center"
    },
    summaryNumbers: {
        fontFamily: "roboto",
        fontWeight: 100,
        fontSize: "2em",
        color: "rgba(0,0,0,.7)"
    }
})

export default withStyles(style)(SaleSummary)