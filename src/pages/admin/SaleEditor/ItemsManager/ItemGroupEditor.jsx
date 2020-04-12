import React from 'react';

import FieldGenerator from '../../../../components/common/FieldGenerator';
import { useFormStyles } from '../../../../styles';


export default function ItemGroupEditor({ itemgroup, ...props }) {
    const classes = useFormStyles()
    const Field = new FieldGenerator(
        itemgroup,
        props.errors,
        props.onChange,
        `itemgroups.${itemgroup.id}`,
        { disabled: props.disabled || props.saving }
    );

    return (
        <div className={classes.column}>
            {Field.text('name', 'Nom', { autoFocus: true })}
            {Field.boolean('is_active', 'Actif')}
            {Field.number('quantity', 'Quantité')}
            {Field.number('max_per_user', 'Max par acheteur')}
        </div>
    );
}
