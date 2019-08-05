import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import { MoreVert, Home, ShoppingCart, AccountCircle } from '@material-ui/icons';
import { AppBar, Toolbar, Button, Menu, Divider } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { NavButton, NavMenuItem } from './common/Nav.jsx';
import { textOrIcon } from '../utils';

const decorator = connect(store => ({
	auth: store.getData('auth', {}),
}));

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			largeDisplay: false,
			authMenuTarget: null,
		};
	}

	componentWillMount() {
		const mediaQuery = window.matchMedia('(min-width: 600px)');
		this.setSize(mediaQuery);
		mediaQuery.addListener(this.setSize);
	}

	setSize = mediaQuery => this.setState({ largeDisplay: mediaQuery.matches })
	
	openAuthMenu  = event => this.setState({ authMenuTarget: event.currentTarget })
	closeAuthMenu = event => this.setState({ authMenuTarget: null })

	render() {
		const { auth, classes } = this.props;
		const { largeDisplay } = this.state;
		return (
			<AppBar position="fixed" style={{ minHeight: this.props.height }}>
				<Toolbar className={'container ' + classes.toolbar}>
					<NavLink className={classes.brand} to="/">Woolly</NavLink>
					<div>
						<NavButton to="/">{textOrIcon('Accueil', Home, largeDisplay)}</NavButton>
						<NavButton to="/sales">{textOrIcon('Ventes', ShoppingCart, largeDisplay)}</NavButton>
						{auth.authenticated ? (
							<React.Fragment>
								{auth.user.is_admin && (
									<NavButton to="/admin">Administration</NavButton>
								)}
								<Button color="inherit" onClick={this.openAuthMenu}>
									{largeDisplay ? (
										<React.Fragment>{auth.user.first_name} <MoreVert /></React.Fragment>
									) : <AccountCircle />}
								</Button>
								<Menu
									anchorEl={this.state.authMenuTarget}
									open={Boolean(this.state.authMenuTarget)}
									onClose={this.closeAuthMenu}
								>
									<NavMenuItem to="/account">Mon compte</NavMenuItem>
									<NavMenuItem to="/orders">Mes commandes</NavMenuItem>
									<Divider />
									<NavMenuItem to="/logout">Se déconnecter</NavMenuItem>
								</Menu>
							</React.Fragment>
						) : (
							<NavButton to="/login">Se connecter</NavButton>
						)}
					</div>
				</Toolbar>
			</AppBar>
		);
	}
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
};

const styles = theme => ({
	toolbar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		margin: 'auto',
		boxSizing: 'border-box',
	},
	brand: {
		fontSize: 20,
		color: 'white',
		textDecoration: 'none',
	},
	logo: {
		maxHeigth: 70,
		maxWidth: 180,
	},
});

export default decorator(withStyles(styles)(Header));
