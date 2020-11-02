import React from 'react';
import { Box, Paper, Grid, Button } from '@material-ui/core';

import { mergeClasses, useFormStyles } from '../../../styles';
import { LoadingButton } from '../../../components/common/Buttons';
import FieldGenerator from '../../../components/common/FieldGenerator';

export default function DetailsEditor({ disabled, editing, isCreator, ...props }) {
	disabled = disabled || props.saving;
	const classes = useFormStyles();
	const Field = new FieldGenerator(props.details, props.errors, props.onChange, 'details', { disabled });

	const onlyCreate = { required: true, disabled: !isCreator || disabled };
	return (
		<Paper className={classes.editor}>
			<Grid container spacing={3}>
				<Grid item xs sm={6} className={classes.column}>
					<h4>Description</h4>
					{Field.text('name', 'Nom', { required: true, autoFocus: true })}
					{Field.text('id', 'ID', onlyCreate)}
					{Field.select('association', 'Association', props.assos, onlyCreate)}
					{Field.text('description', 'Description', { required: true, multiline: true, rows: 4 })}
				</Grid>

				<Grid item xs sm={6} className={mergeClasses(classes, 'column', 'controls')}>
					<h4>Disponibilité</h4>
					{Field.datetime('begin_at', 'Ouverture', { required: true })}
					{Field.datetime('end_at', 'Fermeture', { required: true })}
					{Field.boolean('is_active', 'Active')}
					{Field.boolean('is_public', 'Publique')}
					{Field.number('max_item_quantity', 'Quantité max')}
				</Grid>
			</Grid>
			<Box textAlign="center" mt={4}>
				<Button onClick={props.onReset} name="details" disabled={!editing}>
					Annuler
				</Button>
				<LoadingButton onClick={props.onSave} loading={props.saving} disabled={!editing}>
					{ isCreator ? "Créer" : "Sauvegarder"}
				</LoadingButton>
			</Box>
		</Paper>
	);
}
