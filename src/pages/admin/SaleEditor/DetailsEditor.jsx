import React from 'react';
import { Box, Paper, Grid, Button } from '@material-ui/core';

import { mergeClasses, withFormStyles } from '../../../styles';
import FieldGenerator from '../../../components/common/FieldGenerator';


function DetailsEditor({ classes, isCreator, ...props }) {
	const Field = new FieldGenerator(props.details, props.errors, props.onChange, 'details');
	const onlyCreate = { required: true, disabled: !isCreator };
	const required = { required: true };
	return (
		<Box clone p={2}>
			<Paper>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={8} xl={6} className={classes.column}>
						<h4>Description</h4>
						{Field.text('name', 'Nom', { ...required, autoFocus: true })}
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
			</Paper>
		</Box>
	);
}


export default withFormStyles(DetailsEditor);
