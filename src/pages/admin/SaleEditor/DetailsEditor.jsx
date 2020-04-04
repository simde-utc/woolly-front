import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { mergeClasses } from '../../../utils';

import FieldGenerator from '../../../components/common/FieldGenerator';


function DetailsEditor({ classes, isCreator, ...props }) {
	const Field = new FieldGenerator(props.details, props.errors, props.onChange, 'details');
	const onlyCreate = { required: true, disabled: !isCreator };
	const required = { required: true };
	return (
		<React.Fragment>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={8} xl={6} className={classes.column}>
					<h4>Description</h4>
					{Field.text('name', 'Nom', required)}
					{Field.text('id', 'ID', onlyCreate)}
					{Field.select('association', 'Association', props.assos, onlyCreate)}
					{Field.text('description', 'Description', { required: true, multiline: true, rows: 4 })}
				</Grid>

				<Grid container item xs={12} sm={4} className={mergeClasses(classes, 'column', 'controls')}>
					<h4>Disponibilité</h4>
					{Field.datetime('begin_at', 'Ouverture', required)}
					{Field.datetime('end_at', 'Fermeture', required)}
					{Field.boolean('is_active', 'Active')}
					{Field.boolean('is_public', 'Publique')}
					{Field.number('max_item_quantity', 'Quantité max')}
				</Grid>
			</Grid>
			<Button onClick={props.onSave} disabled={props.saving}>
				{ isCreator ? "Créer" : "Sauvegarder"}
			</Button>
		</React.Fragment>
	);
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
