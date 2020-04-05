import React from 'react';

import FieldGenerator from '../../../../components/common/FieldGenerator';
import { withFormStyles } from '../../../../styles';


function ItemGroupEditor({ classes, itemgroup, disabled, ...props }) {
    disabled = disabled || props.saving;
    const Field = new FieldGenerator(itemgroup, props.errors, props.onChange, `itemgroups.${itemgroup.id}`, { disabled });
    return (
        <div className={classes.column}>
            {Field.text('name', 'Nom', { autoFocus: true })}
            {Field.boolean('is_active', 'Actif')}
            {Field.number('quantity', 'Quantité')}
            {Field.number('max_per_user', 'Max par acheteur')}
        </div>
    );
}

export default withFormStyles(ItemGroupEditor);
