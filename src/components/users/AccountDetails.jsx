import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { capitalFirst } from '../../utils';

class AccountDetails extends React.Component{
	reduceTypes = () => (
		Object.entries(this.props.user.types || {})
		      .filter(([key, value]) => value)
		      .map(([key, value]) => capitalFirst(key))
		      .join(', ')
	)

	render() {
		const { classes, user } = this.props
		return (
			<div className={classes.container}>
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
			</div>
		);
	}
}

AccountDetails.propTypes = {
	classes : PropTypes.object.isRequired
}

const styles = {
	container: {
		overflowX: 'auto',
	},
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
	}
};

export default withStyles(styles)(AccountDetails);
