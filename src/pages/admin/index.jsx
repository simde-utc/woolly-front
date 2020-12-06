import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasManagerRights } from 'utils/api';

import Loader from 'components/common/Loader';
import AdminNav from 'pages/admin/AdminNav';
import Dashboard from 'pages/admin/Dashboard';
import AssoDashboard from 'pages/admin/AssoDashboard';
import SaleView from 'pages/admin/SaleView';
import SaleDetail from 'pages/admin/SaleDetail/index';
import SaleEditor from 'pages/admin/SaleEditor/index';
import Error404 from 'pages/Error404';


export default function AdminSite(props) {
    // Get data from store
    const auth = useSelector(store => store.api.getData('auth'));
    const userAssos = useSelector(store => store.api.getAuthRelatedData('associations', null));

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
                <Redirect exact from="/admin/sales/:sale_id" to="/admin/sales/:sale_id/quantities" />
                <Route exact path="/admin/sales/:sale_id/view" component={SaleView} />
                <Route exact path="/admin/sales/:sale_id/edit" component={SaleEditor} />
                <Route exact path="/admin/sales/:sale_id/:view(quantities|tickets|orders|charts)" component={SaleDetail} />
                <Route component={Error404} />
            </Switch>
        </React.Fragment>
    );
}
