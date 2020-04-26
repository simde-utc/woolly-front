import React from 'react';
import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom';
import { Button, IconButton, ListItem, MenuItem, Link as MuiLink } from '@material-ui/core';

// --------------------------------------------------------------------------
// 		Reference Adaptaters
// --------------------------------------------------------------------------

export const LinkRef    = React.forwardRef((props, ref) => <RouterLink    {...props} innerRef={ref} />);
export const NavLinkRef = React.forwardRef((props, ref) => <RouterNavLink {...props} innerRef={ref} />);


// --------------------------------------------------------------------------
// 		Components
// --------------------------------------------------------------------------

export const Link = React.forwardRef((props, ref) => (
	<MuiLink component={'to' in props ? RouterLink : undefined} {...props} />
));

export const NavButton = React.forwardRef((props, ref) => (
    <Button component={NavLinkRef} exact color="inherit" {...props} />
));

export const NavIconButton = React.forwardRef((props, ref) => (
    <IconButton component={NavLinkRef} exact color="inherit" {...props} />
));

export const NavListItem = React.forwardRef((props, ref) => (
    <ListItem button component={NavLinkRef} exact {...props} />
));

export const NavMenuItem = React.forwardRef((props, ref) => (
	<MenuItem component={NavLinkRef} exact {...props} />
));

