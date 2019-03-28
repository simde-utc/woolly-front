import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { MoreVert } from '@material-ui/icons';
import { AppBar, Toolbar, Button, Menu, MenuItem, Divider } from '@material-ui/core';
import NavButton from './common/NavButton.jsx';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expandMenu: false,
			dropdownTarget: null,
		};
	}

	openDropdown = event => this.setState({ dropdownTarget: event.currentTarget })
	closeDropdown = () => this.setState({ dropdownTarget: null })

	render() {
		const { classes } = this.props;
		const isConnected = !false;
		const isAdmin = !false;
		
		return (
			<AppBar position="fixed" style={{ height: this.props.height }}>
				<Toolbar className={classes.toolbar + ' container'}>
					<span className={classes.brand}>Woolly</span>
					<div>
						<NavButton to="/">Accueil</NavButton>
						<NavButton to="/ventes">Ventes</NavButton>
						{isConnected ? (
							<React.Fragment>
								<Button color="inherit" onClick={this.openMenu}>Alexandre <MoreVert /></Button>
								<Menu
									anchorEl={this.state.dropdownTarget}
									open={Boolean(this.state.dropdownTarget)}
									onClose={this.closeMenu}
								>
									<MenuItem>Mes commandes</MenuItem>
									<MenuItem>Mon compte</MenuItem>
									{isAdmin && (
										<MenuItem>Administration</MenuItem>
									)}
									<Divider />
									<MenuItem>Se déconnecter</MenuItem>
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
	},
	brand: {
		fontSize: 24,
	},
	logo: {
		maxHeigth: 70,
		maxWidth: 180,
	},
	menuButton: {
		color: 'inherit',
		// fontSize: 20,
	},
});

export default withStyles(styles)(Header);
