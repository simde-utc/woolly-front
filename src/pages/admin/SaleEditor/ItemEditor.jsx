import React from 'react';
import { Grid, Button } from '@material-ui/core';
import FieldGenerator from '../../../components/common/FieldGenerator';


function ItemEditor({ item, ...props }) {
    const Field = new FieldGenerator(item, props.errors, props.onChange, `items.${item.id}`);
	return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    <h4>Description</h4>
                    {Field.text('name', 'Nom')}
                    {Field.text('description', 'Description')}
                    {Field.select('group', 'Groupe', props.itemgroups)}
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
                <Button name="items" value={item.id} onClick={props.onReset}>
                    Annuler
                </Button>
                <Button name="items" value={item.id} onClick={props.onSave}>
                    {item._isNew ? "Créer" : "Sauvegarder" }
                </Button>
                {!item._isNew && (
                    <Button name="items" value={item.id} onClick={props.onDelete}>
                        Supprimer
                    </Button>
                )}
            </div>
        </div>
	);
}

export default ItemEditor;