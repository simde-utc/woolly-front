import React from 'react';
import { Button } from '@material-ui/core';
import FieldGenerator from '../../../components/common/FieldGenerator';


class ItemGroupEditor extends React.Component {

    constructor(props) {
        super(props);
        this.field = new FieldGenerator(props.itemgroup, props.errors, props.handleChange, `itemgroups.${props.itemgroup.id}`);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.field.needUpdate(nextProps.itemgroup, nextProps.errors, nextProps.handleChange, `itemgroups.${nextProps.itemgroup.id}`);
    }

    render() {
        const isNew = this.props.itemgroup._isNew;
        return (
            <React.Fragment>
                {this.field.text('name', 'Nom')}
                {this.field.boolean('is_active', 'Actif')}
                {this.field.number('quantity', 'Quantité')}
                {this.field.number('max_per_user', 'Max par acheteur')}

                <Button name="itemgroups" value={this.props.itemgroup.id} onClick={this.props.handleSave}>
                    {isNew ? "Créer" : "Sauvegarder" }
                </Button>
                {!isNew && (
                    <Button name="itemgroups" value={this.props.itemgroup.id} onClick={this.props.handleDelete}>
                        Supprimer
                    </Button>
                )}

            </React.Fragment>
        );
    }
}



export default ItemGroupEditor;