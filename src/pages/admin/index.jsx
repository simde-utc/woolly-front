import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasManagerRights } from '../../utils';

import Loader from '../../components/common/Loader';
import AdminNav from './AdminNav';
import Dashboard from './Dashboard';
import AssoDashboard from './AssoDashboard';
import SaleView from './SaleView';
import SaleDetail from './SaleDetail/';
import SaleEditor from './SaleEditor/';
import Error404 from '../Error404';


export default function AdminSite(props) {
    // Get data from store
    const auth = useSelector(store => store.getData('auth'));
    const userAssos = useSelector(store => store.getAuthRelatedData('associations', null));

    // Wait for user's associations to be fetched
    if (userAssos === null)
        return <Loader />

    // Redirect if user has no manager rights
    if (!hasManagerRights(auth, userAssos))
        return <Redirect to="/" />

    return (
        <React.Fragment>
            <AdminNav />
            <Switch>
                <Route exact path="/admin" component={Dashboard} />
                <Route exact path="/admin/assos/:asso_id" component={AssoDashboard} only="asso_manager" />
                <Route exact path="/admin/sales/create" component={SaleEditor} />
                <Redirect exact from="/admin/sales/:sale_id" to="/admin/sales/:sale_id/stats" />
                <Route exact path="/admin/sales/:sale_id/view" component={SaleView} />
                <Route exact path="/admin/sales/:sale_id/edit" component={SaleEditor} />
                <Route exact path="/admin/sales/:sale_id/stats" component={SaleDetail} />
                <Route component={Error404} />
            </Switch>
        </React.Fragment>
    );
}
