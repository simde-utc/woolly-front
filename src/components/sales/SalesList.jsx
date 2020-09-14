import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { NavListItem, NavIconButton } from '../common/Nav';
import { Add, Edit } from '@material-ui/icons';
import { SkeletonList } from '../../components/common/Skeletons';
import { isEmpty } from '../../utils';


export default function SalesList({ sales, baseUrl, withEdit, assoId, ...props }) {

	if (!sales)
		return <SkeletonList nRows={2} withSecondary withAction {...props} />;

	const createSaleLink = {
		pathname: "/admin/sales/create",
		state: { asso_id: assoId },
	};
	return (
		<List style={{ padding: 0 }} {...props}>
			{isEmpty(sales) ? (				
				<ListItem button disabled>
					<ListItemText primary="Pas de ventes" />
				</ListItem>
			) : (
				Object.values(sales).map(sale => (
					<NavListItem key={sale.id} to={`${baseUrl}/sales/${sale.id}`} aria-label="see-sale">
						<ListItemText primary={sale.name} />
						{withEdit && (
							<ListItemSecondaryAction>
								<NavIconButton
									to={`${baseUrl}/sales/${sale.id}/edit`}
									aria-label="edit-sale"
									edge="end"
								>
									<Edit />
								</NavIconButton>
							</ListItemSecondaryAction>
						)}
					</NavListItem>
				))
			)}
			{withEdit && (
				<NavListItem to={createSaleLink}>
					<ListItemText primary="Créer une vente" />
					<ListItemSecondaryAction>
						<NavIconButton edge="end" aria-label="add-sale" to={createSaleLink}>
							<Add />
						</NavIconButton>
					</ListItemSecondaryAction>
				</NavListItem>
			)}
		</List>    
	);
}

SalesList.propTypes = {
	sales: PropTypes.object,
	baseUrl: PropTypes.string,
	withEdit: PropTypes.bool,
	assoId: PropTypes.string,
};

SalesList.defaultProps = {
	sales: null,
	baseUrl: '',
	withEdit: false,
	assoId: null,
};
