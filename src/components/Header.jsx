import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import apiActions from '../redux/actions/api';

import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Container, Button, Menu, Divider, useMediaQuery } from '@material-ui/core';
import { MoreVert, Home, ShoppingCart, AccountCircle } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';
import { NavButton, NavMenuItem } from './common/Nav.jsx';
import { hasManagerRights, textOrIcon } from '../utils';


const useStyles = makeStyles(theme => ({
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	brand: {
		fontSize: 20,
		color: 'inherit',
		textDecoration: 'none',
	},
}))

export default function Header(props) {

	const classes = useStyles();
	const largeDisplay = useMediaQuery('(min-width: 600px)');
	const [menuTarget, setMenuTarget] = React.useState(null);

	const dispatch = useDispatch();
	const auth = useSelector(store => store.api.getData('auth', {}));
	const userAssos = useSelector(store => store.api.getAuthRelatedData('associations', null));

	React.useEffect(() => {
		if (auth.user && !userAssos)
			dispatch(apiActions.authUser(auth.user.id).associations.all({ page_size: 'max' }));
	});

	return (
		<AppBar
			position="static"
			color="default"
			elevation={0}
			style={{
				minHeight: 64,
				borderBottom: '1px solid #65656575',
			}}
		>
			<Container component={Toolbar} className={classes.toolbar}>
				<NavLink className={classes.brand} to="/">Woolly</NavLink>
				<div>
					{/* TODO Set to IconButton when icon */}
					<NavButton to="/">{textOrIcon('Accueil', Home, largeDisplay)}</NavButton>
					<NavButton to="/sales">{textOrIcon('Ventes', ShoppingCart, largeDisplay)}</NavButton>
					{auth.authenticated ? (
						<React.Fragment>
							<Button color="inherit" onClick={event => setMenuTarget(event.currentTarget)}>
								{(largeDisplay
									? <React.Fragment>{auth.user.first_name} <MoreVert /></React.Fragment>
									: <AccountCircle />
								)}
							</Button>
							<Menu
								open={Boolean(menuTarget)}
								onClose={event => setMenuTarget(null)}
								anchorEl={menuTarget}
							>
								<NavMenuItem to="/account">Mon compte</NavMenuItem>
								<NavMenuItem to="/orders">Mes commandes</NavMenuItem>
								{hasManagerRights(auth, userAssos) && (
									<NavMenuItem to="/admin">Administration</NavMenuItem>
								)}
								<Divider />
								<NavMenuItem to="/logout">Se déconnecter</NavMenuItem>
							</Menu>
						</React.Fragment>
					) : (
						<NavButton to="/login">Se connecter</NavButton>
					)}
				</div>
			</Container>
		</AppBar>
	);
}
