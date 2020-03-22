import React from 'react';
import { Grid, Button } from '@material-ui/core';
import FieldGenerator from '../../../components/common/FieldGenerator';


class SaleDetailsEditor extends React.Component {

	constructor(props) {
		super(props);
		this.field = new FieldGenerator(this.props.details, this.props.handleChange, 'details');
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.field.needUpdate(nextProps.details, nextProps.handleChange);
	}

	render() {
		return (
			<React.Fragment>
				<Grid container spacing={3}>
					<Grid item md={6}>
						{this.field.text('name', 'Nom')}
						{this.field.text('description', 'Description', { multiline: true, rows: 4 })}
						{this.field.select('association', 'Association', this.props.assos)}
					</Grid>

					<Grid item md={6}>
						{this.field.datetime('begin_at', 'Ouverture')}
						{this.field.datetime('end_at', 'Fermeture')}
						{this.field.boolean('is_active', 'Active')}
						{this.field.boolean('is_public', 'Publique')}
						{this.field.integer('max_item_quantity', 'Quantité max')}
					</Grid>
				</Grid>
				<Button onClick={this.props.handleSave}>
					{ this.props.isCreator ? "Créer" : "Sauvegarder"}
				</Button>
			</React.Fragment>
		);
	}

}

export default SaleDetailsEditor;
