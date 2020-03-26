import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { mergeClasses } from '../../../utils';

import FieldGenerator from '../../../components/common/FieldGenerator';


class DetailsEditor extends React.Component {

	constructor(props) {
		super(props);
		this.field = new FieldGenerator(this.props.details, this.props.errors, this.props.handleChange, 'details');
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.field.needUpdate(nextProps.details, nextProps.errors, nextProps.handleChange);
	}

	render() {
		const { classes, isCreator } = this.props;
		const cantUpdate = { disabled: !isCreator };
		return (
			<React.Fragment>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={8} className={classes.column}>
						{this.field.text('id', 'ID', cantUpdate)}
						{this.field.text('name', 'Nom')}
						{this.field.select('association', 'Association', this.props.assos, cantUpdate)}
						{this.field.text('description', 'Description', { multiline: true, rows: 4 })}
					</Grid>

					<Grid container item xs={12} sm={4} className={mergeClasses(classes, 'column', 'controls')}>
						<Grid item xs={12}>
							{this.field.datetime('begin_at', 'Ouverture')}
							{this.field.datetime('end_at', 'Fermeture')}
						</Grid>
						{this.field.boolean('is_active', 'Active')}
						{this.field.boolean('is_public', 'Publique')}
						{this.field.integer('max_item_quantity', 'Quantité max')}
					</Grid>
				</Grid>
				<Button onClick={this.props.handleSave} disabled={this.props.saving}>
					{ isCreator ? "Créer" : "Sauvegarder"}
				</Button>
			</React.Fragment>
		);
	}

}

const styles = {
	column: {
		display: 'flex',
		flexDirection: 'column',
		paddingTop: '0 !important',
		paddingBottom: '0 !important',
	},
	controls: {
		maxWidth: 300,
	},
};

export default withStyles(styles)(DetailsEditor);
