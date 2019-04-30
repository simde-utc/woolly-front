import React from 'react'
import { connect } from 'react-redux';
import actions from '../../redux/actions';

import Loader from '../../components/Loader';
import SaleCard from '../../components/common/SaleCard';

const decorator = connect(store => ({
	sales: store.getData('sales'),
	pagination: store.getPagination('sales'),
	fetching: store.isFetching('sales'),
	fetched: store.isFetched('sales'),
}))

class Sales extends React.Component {
    componentDidMount(){
        this.props.dispatch(actions.sales.all({ include: 'association' }))
    }

    render(){
        const { sales, fetched, fetching } = this.props;
        return(
			<div className="container" style={{marginTop: "60px"}}>
                <h2 style={titleStyle}>Liste des ventes de {"Baignoires dans l'Oise"}</h2>
                <Loader loading={!fetched || fetching} text=" Récupération des ventes en cours...">
                    <div style={{ display: 'flex' }}>
                        {sales.map(sale => (
                            <SaleCard key={sale.id} sale={sale} />
                        ))}
                    </div>
                </Loader>
            </div>
        )
    }
}

const titleStyle = {
    fontFamily: "roboto, sans-serif",
    fontWeight: "lighter",
    fontSize: "2em",
}

export default decorator(Sales)