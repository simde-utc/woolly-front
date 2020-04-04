import React from 'react';
import { Grid, Button } from '@material-ui/core';
import FieldGenerator from '../../../components/common/FieldGenerator';


function ItemEditor({ item, ...props }) {
    const Field = new FieldGenerator(item, props.errors, props.onChange, `items.${item.id}`);
    const buttonProps = { name: 'items', value: item.id };
	return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    <h4>Description</h4>
                    {Field.text('name', 'Nom')}
                    {Field.text('description', 'Description')}
                    {Field.select('group', 'Groupe', props.itemgroups, { default: 'null' })}
                    {Field.select('usertype', 'Type d\'acheteur', props.usertypes)}
                    {Field.number('price', 'Prix')}
                </Grid>

                <Grid item xs={12} sm={5}>
                    <h4>Disponibilité</h4>
                    {Field.boolean('is_active', 'Actif')}
                    {Field.number('quantity', 'Quantité')}
                    {Field.number('max_per_user', 'Max par acheteur')}
                </Grid>
            </Grid>

            <h4>Champs</h4>
            <p>TODO w/ chips</p>

            <div>
                <Button onClick={props.onReset} {...buttonProps}>
                    Annuler
                </Button>
                <Button onClick={props.onSave} {...buttonProps}>
                    {item._isNew ? "Créer" : "Sauvegarder" }
                </Button>
                {!item._isNew && (
                    <Button onClick={props.onDelete} {...buttonProps}>
                        Supprimer
                    </Button>
                )}
            </div>
        </div>
	);
}

export default ItemEditor;