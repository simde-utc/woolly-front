import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@material-ui/core';

class NavButton extends React.Component {
	render() {
		const { children, ...props } = this.props;
		return (
			<Button
				component={NavLink}
				exact
				color="inherit"
				{...props}
			>
				{children}
			</Button>
		);
	}
}

export default NavButton;
