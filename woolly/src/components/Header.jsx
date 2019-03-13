import React from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, Divider } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuTarget: null,
		};
	}

	openMenu = event => this.setState({ menuTarget: event.currentTarget })
	closeMenu = () => this.setState({ menuTarget: null })

	render() {
		const isConnected = !false;
		const isAdmin = !false;
		return (
			<AppBar position="fixed" style={{ height: this.props.height }}>
				<Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
					<span>Woolly</span>
					<div>
						<Button color="inherit">Accueil</Button>
						<Button color="inherit">Ventes</Button>
						{isConnected ? (
							<React.Fragment>
								<Button color="inherit" onClick={this.openMenu}>Alexandre <MoreVert/></Button>
								<Menu
									anchorEl={this.state.menuTarget}
									open={Boolean(this.state.menuTarget)}
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
							<Button color="inherit">Se connecter</Button>
						)}
					</div>
				</Toolbar>
			</AppBar>
		);
	}
}

export default Header;