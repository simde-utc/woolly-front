import React from 'react';
import { Grid } from '@material-ui/core';

import FieldGenerator from '../../../../components/common/FieldGenerator';
import { withFormStyles } from '../../../../styles';


function ItemEditor({ classes, item, disabled, ...props }) {
    disabled = disabled || props.saving;
    const Field = new FieldGenerator(item, props.errors, props.onChange, `items.${item.id}`, { disabled });
    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} className={classes.column}>
                    <h4>Description</h4>
                    {Field.text('name', 'Nom', { autoFocus: true })}
                    {Field.text('description', 'Description', { multiline: true, rows: 2 })}
                    {Field.select('group', 'Groupe', props.itemgroups, { default: 'null' })}
                    {Field.select('usertype', 'Type d\'acheteur', props.usertypes)}
                    {Field.number('price', 'Prix')}
                </Grid>

                <Grid item xs={12} sm={6} className={classes.column}>
                    <h4>Disponibilité</h4>
                    {Field.boolean('is_active', 'Actif')}
                    {Field.number('quantity', 'Quantité')}
                    {Field.number('max_per_user', 'Max par acheteur')}
                </Grid>
            </Grid>

            {!item._isNew && (
                <React.Fragment>
                    <h4>Champs</h4>
                    <p>TODO w/ chips</p>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

export default withFormStyles(ItemEditor);