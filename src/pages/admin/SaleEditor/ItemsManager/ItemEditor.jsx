import React from 'react';
import { Grid } from '@material-ui/core';

import { withFormStyles } from '../../../../styles';
import FieldGenerator from '../../../../components/common/FieldGenerator';


function ItemEditor({ classes, item, ...props }) {
    const Field = new FieldGenerator(item, props.errors, props.onChange, `items.${item.id}`);
	return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7} className={classes.column}>
                    <h4>Description</h4>
                    {Field.text('name', 'Nom')}
                    {Field.text('description', 'Description', { multiline: true, rows: 2 })}
                    {Field.select('group', 'Groupe', props.itemgroups, { default: 'null' })}
                    {Field.select('usertype', 'Type d\'acheteur', props.usertypes)}
                    {Field.number('price', 'Prix')}
                </Grid>

                <Grid item xs={12} sm={5} className={classes.column}>
                    <h4>Disponibilité</h4>
                    {Field.boolean('is_active', 'Actif')}
                    {Field.number('quantity', 'Quantité')}
                    {Field.number('max_per_user', 'Max par acheteur')}
                </Grid>
            </Grid>

            <h4>Champs</h4>
            <p>TODO w/ chips</p>
        </React.Fragment>
	);
}

export default withFormStyles(ItemEditor);