import React from 'react';
import { Grid, Button } from '@material-ui/core';
import FieldGenerator from '../../../components/common/FieldGenerator';


class ItemEditor extends React.Component {

    constructor(props) {
        super(props);
        this.field = new FieldGenerator(props.item, props.errors, props.handleChange, `items.${props.item.id}`);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.field.needUpdate(nextProps.item, nextProps.errors, nextProps.handleChange, `items.${nextProps.item.id}`);
    }

	render() {
        const isNew = this.props.item._isNew;
		return (
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <h4>Description</h4>
                        {this.field.text('name', 'Nom')}
                        {this.field.text('description', 'Description')}
                        {this.field.select('group', 'Groupe', [])}
                        {this.field.select('usertype', 'Type d\'acheteur', this.props.usertypes)}
                        {this.field.number('price', 'Prix')}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <h4>Disponibilité</h4>
                        {this.field.boolean('is_active', 'Actif')}
                        {this.field.number('quantity', 'Quantité')}
                        {this.field.number('max_per_user', 'Max par acheteur')}
                    </Grid>
                </Grid>

                <h4>Champs</h4>
                <p>TODO</p>

                <br/>
                <Button name="items" value={this.props.item.id} onClick={this.props.handleSave}>
                    {isNew ? "Créer" : "Sauvegarder" }
                </Button>
                {!isNew && (
                    <Button name="items" value={this.props.item.id} onClick={this.props.handleDelete}>
                        Supprimer
                    </Button>
                )}
                <hr/>
            </div>
		);
	}
}



export default ItemEditor;