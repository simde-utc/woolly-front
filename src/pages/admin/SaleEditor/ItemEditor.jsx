import React from 'react';
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
		return (
            <React.Fragment>
                {this.field.text('name', 'Nom')}
                {this.field.text('description', 'Description')}
                {this.field.number('price', 'Prix')}
                {this.field.select('group', 'Groupe', [])}

                {this.field.boolean('is_active', 'Actif')}
                {this.field.number('quantity', 'Quantité')}
                {this.field.number('max_per_user', 'Max par acheteur')}
                {this.field.select('usertype', 'Type d\'acheteur', this.props.usertypes)}

                <h4>Champs</h4>
                <span>TODO</span>
            </React.Fragment>
		);
	}
}



export default ItemEditor;