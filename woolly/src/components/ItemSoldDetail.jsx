import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';

import { Paper, Table, TableHead, TableRow, TableBody, TableCell, Tooltip, TableSortLabel, IconButton, Checkbox, FormControlLabel } from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'

const rows = [
    { id: 'name', label: 'Nom' },
    { id: 'firstname', label: 'Prénom' },
    { id: 'status', label: 'Statut' },
    { id: 'quantity', label: 'Quantité' }
]

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
function stableSort(array, cmp) {
const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class ItemSoldDetail extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            orderBy: "none",
            order: 'asc',
            onlyCotisant: false,
            showFilters: false
        }
    }

    createSotHandler(id){
        const orderBy = id;
        let order = 'desc';

        if (this.state.orderBy === id && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    }

    handleShow = event => {
        this.setState(prevState => ({ showFilters: !prevState.showFilters }))
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };
    

    render(){
        const { classes } = this.props

        return(
            <Paper className={classes.paper}>
                <div className={classes.titleRoot}>
                    <h2 className={classes.detailsTitle}>Détails des ventes de l'item : <span className={classes.detailsTitle_itemName}>{this.props.item.title}</span></h2>
                </div>
                <div className={classes.tableParent}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                {rows.map(row => (
                                    <TableCell key={row.id}>
                                        <Tooltip
                                            title="Sort"
                                            enterDelay={300}
                                            >
                                            <TableSortLabel
                                                active={this.state.orderBy === row.id}
                                                direction={this.state.order}
                                                onClick={() => this.createSotHandler(row.id)}
                                            >
                                                {row.label}
                                            </TableSortLabel>
                                        </Tooltip>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stableSort(this.props.item.buyers, getSorting(this.state.order, this.state.orderBy))
                                .map((element, key) => {
                                    return(
                                        <TableRow key={key}>
                                            <TableCell>{element.name}</TableCell>
                                            <TableCell>{element.firstname}</TableCell>
                                            <TableCell>{element.status}</TableCell>
                                            <TableCell>{element.quantity}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        )
    }
}

ItemSoldDetail.propTypes = {
    classes: PropTypes.object.isRequired
}

const styles = theme => ({
    titleRoot: {
        display: 'flex',
        alignItems: "center",
        justifyContent: "space-between"
    },
    detailsTitle: {
        fontFamily: "roboto",
        fontWeight: 300,
        textAlign: "center",
        fontSize: "1.5em",
    },
    detailsTitle_itemName: {
        color: "rgba(0,0,0,.7)",
        fontSize: "1.2em",
        fontWeight: 400
    },
    paper: {
        padding: "1em",
        margin: "2em 0",
        width: "calc(100% - 30px)",
        boxSizing: "border-box"
    },
    tableParent: {
        overflowX: "auto",
        margin: "0 0.5em"
    }
})

export default withStyles(styles)(ItemSoldDetail)