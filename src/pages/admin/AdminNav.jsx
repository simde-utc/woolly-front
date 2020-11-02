import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, matchPath } from 'react-router-dom';

import { Container, Grid, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, Edit, BarChart } from '@material-ui/icons';
import { NavIconButton, Link } from '../../components/common/Nav';

const ADMIN_LINKS = [
	{
		path: "/admin",
		title: "Dashboard",
	},
	{
		title: "Création d'une vente",
		path: "/admin/sales/create",
	},
	{
		resource: "associations",
		path: "/admin/assos/:id",
	},
	{
		key: "stats",
		resource: "sales",
		title: "Statistiques",
		icon: <BarChart />,
		path: "/admin/sales/:id/stats",
	},
	{
		key: "view",
		resource: "sales",
		title: "Vente",
		icon: <Visibility />,
		path: "/admin/sales/:id/view",
	},
	{
		key: "edit",
		resource: "sales",
		title: "Édition",
		icon: <Edit />,
		path: "/admin/sales/:id/edit",
	},
];

/** Find link that matches the location */
function getMatch(location) {
	for (const action of ADMIN_LINKS) {
		const match = matchPath(location.pathname, {
			path: action.path,
			exact: true,
			strict: true,
		})
		if (match)
			return { ...match, ...action };
	}
	return null;
}

function getNavData(match, resource) {
	if (!match)
		return {};
	switch (match.resource) {
		case 'associations':
			return {
				title: (resource && resource.shortname) || '...',
			};
		case 'sales':
			return {
				title: resource ? `${match.title} - ${resource.name || '...'}` : match.title,
				actions: (
					ADMIN_LINKS.filter(link => link.resource === "sales").map(link => (
						<NavIconButton
							key={link.key}
							to={link.path.replace(':id', match.params.id)}
							aria-label={`${link.key}-asso`}
							color={match.key === link.key ? 'primary' : 'secondary'}
						>
							{link.icon}
						</NavIconButton>
					))
				)
			};
		default:
			return { title: match.title };
	}
}

const useStyles = makeStyles(theme => ({
	nav: {
		marginBottom: theme.spacing(2),
	},
	titleItem: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		[theme.breakpoints.down('xs')]: {
			order: -1,
			paddingBottom: 0,
		},
	},
	title: {
		margin: 0,
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textAlign: 'center',
	},
}));

export default function AdminNav(props) {
	const classes = useStyles();
	const match = getMatch(useLocation());
	const resource = useSelector(store => (
		match && store.findData(match.resource, match.params && match.params.id)
	));

	const { title, actions } = getNavData(match, resource);
	return (
		<nav className={classes.nav}>
			<Container>
				<Grid
					container
					style={{ minWidth: 65 }}
					justify="space-between"
					alignItems="center"
				>
					<Grid item xs="auto" sm={3} md={2}>
						<Box my={2} pr={1}>
							<Link
								to="/admin"
								color="inherit"
								underline="none"
								variant="button"
							>
								Administration
							</Link>
						</Box>
					</Grid>
					<Grid item xs={12} sm zeroMinWidth className={classes.titleItem}>
						<h1 className={classes.title}>{title || ""}</h1>
					</Grid>
					<Grid item xs="auto" style={{ minWidth: 144 }}>
						{actions}
					</Grid>
				</Grid>
			</Container>
		</nav>
	);
}
