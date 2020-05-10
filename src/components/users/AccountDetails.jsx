import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { TableContainer, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { capitalFirst } from '../../utils';


const useStyles = makeStyles({
	topborder: {
		borderTop: '1px solid rgba(224, 224, 224, 1)',
	},
	label: {
		fontWeight: 500,
		fontSize: '1em',
		paddingRight: '1em',
	},
	value: {
		fontWeight: 200,
	},
});

export default function AccountDetails ({ user }) {
	const classes = useStyles();
	return (
		<TableContainer>
			<Table>
				<TableBody>
					<TableRow className={classes.topborder}>
						<TableCell className={classes.label}>Email</TableCell>
						<TableCell className={classes.value}>{user.email}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className={classes.label}>Prénom</TableCell>
						<TableCell className={classes.value}>{user.first_name}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className={classes.label}>Nom</TableCell>
						<TableCell className={classes.value}>{user.last_name}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className={classes.label}>Type</TableCell>
						<TableCell className={classes.value}>{capitalFirst(user.type)}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

AccountDetails.propTypes = {
	user: PropTypes.object.isRequired,
};
