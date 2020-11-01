import React from 'react';
import SaleDetail from '../public/SaleDetail';
import { Box } from '@material-ui/core';
import { CopyButton } from '../../components/common/Buttons';

export default function SaleView(props) {
    const saleLink = window.location.href.replace('/admin/', '/').replace('/view', '');
    return (
        <React.Fragment>
            <Box textAlign="center" bgcolor="neutral.light" py={2} position="sticky">
                <CopyButton value={saleLink}>Lien de la vente</CopyButton>
            </Box>
            <SaleDetail {...props} />
        </React.Fragment>
    );
}