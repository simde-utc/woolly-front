import React from 'react'
import { makeStyles } from '@material-ui/styles';
import { Collapse, IconButton, List, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { NavListItem, NavIconButton } from '../common/Nav';
import { ExpandMore, ExpandLess, Visibility } from '@material-ui/icons';
import SalesList from './SalesList';


const useStyles = makeStyles(theme => ({
	nested: {
		paddingLeft: theme.spacing(4),
	},
}));

export default function AssoSalesList({ assos, sales, ...props}) {
	const [isOpen, setOpen] = React.useState({});
	const classes = useStyles();

	const handleOpen = event => {
		event.preventDefault();
		const id = event.currentTarget.getAttribute('value');
		// Ask for sales data if not available
		if (!isOpen[id] && !sales[id])
			props.fetchSales(id)
		// Toggle collapse
		setOpen({ ...isOpen, [id]: !isOpen[id] });
	}

	return (
		<List disablePadding>
			{Object.values(assos).map(({ id, ...asso }) => (
				<React.Fragment key={id}>
					<NavListItem to={`/admin/assos/${id}`}>
						<ListItemText primary={asso.shortname} />
						<IconButton onClick={handleOpen} value={id}>
							{isOpen[id] ? <ExpandLess /> : <ExpandMore />}
						</IconButton>
					</NavListItem>
					<Collapse in={Boolean(isOpen[id])} timeout="auto" unmountOnExit>
						<List component="div" disablePadding classes={{ root: classes.nested }}>
							<SalesList
								sales={sales[id]}
								disablePadding
								baseUrl="/admin"
								withEdit
								assoId={id}
							/>
							<NavListItem to={`/admin/assos/${id}`}>
								<ListItemText primary="Voir l'association" />
								<ListItemSecondaryAction>
									<NavIconButton edge="end" aria-label="see-asso" to={`/admin/assos/${id}`}>
										<Visibility />
									</NavIconButton>
								</ListItemSecondaryAction>
							</NavListItem>
						</List>
					</Collapse>

				</React.Fragment>
			))}
		</List>
	);
}
